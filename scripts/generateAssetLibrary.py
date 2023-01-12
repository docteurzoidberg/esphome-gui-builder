import argparse
import io
import voluptuous as vol
import base64
import glob
import json
import os
import shutil
import re

#python enum for image type
class ImageType:
    IMAGE_TYPE_BINARY = 0
    IMAGE_TYPE_GRAYSCALE = 1
    IMAGE_TYPE_RGB24 = 2
    IMAGE_TYPE_TRANSPARENT_BINARY = 3
    IMAGE_TYPE_RGB565 = 4
    IMAGE_TYPE_RGBA32 = 5

IMAGE_TYPE = {
    "BINARY": ImageType.IMAGE_TYPE_BINARY,
    "GRAYSCALE": ImageType.IMAGE_TYPE_GRAYSCALE,
    "RGB24": ImageType.IMAGE_TYPE_RGB24,
    "TRANSPARENT_BINARY": ImageType.IMAGE_TYPE_TRANSPARENT_BINARY,
    "RGB565": ImageType.IMAGE_TYPE_RGB565,
    "RGBA32": ImageType.IMAGE_TYPE_RGBA32
}

class HexInt(int):
    def __str__(self):
        value = self
        sign = "-" if value < 0 else ""
        value = abs(value)
        if 0 <= value <= 255:
            return f"{sign}0x{value:02X}"
        return f"{sign}0x{value:X}"

#manifest json format
class ManifestJson:
    def __init__(self, name, version, buildpath, description, files) -> None:
        self.name = name
        self.version = version
        self.buildpath = buildpath
        self.files = files
        self.description = description

#screen preset json format
class ScreenPresetJson:
    def __init__(self, name, colormode, background, width, height, scale, showgrid, gridsize) -> None:
        self.name = name
        self.width = width
        self.height = height
        self.showgrid = showgrid
        self.scale = scale
        self.gridsize = gridsize
        self.colormode = colormode
        self.background = background

#image json format
class ImageJson:
    def __init__(self, id, name, path, type, width, height, data, dataurl) -> None:
        self.id = id
        self.name = name
        self.path = path
        self.type = type
        self.width = width
        self.height = height
        self.dataurl = dataurl
        self.data = data

#animation json format
class AnimationJson:
    def __init__(self, id, name, path, type, width, height, frames, data, dataurl) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.path = path
        self.width = width
        self.height = height
        self.frames = frames
        self.data = data
        self.dataurl = dataurl

#font glyph format
class FontGlyph:
    def __init__(self, glyph, offset_x, offset_y, width, height, start) -> None:
        self.glyph = glyph
        self.offset_x = offset_x
        self.offset_y = offset_y
        self.width = width
        self.height = height
        self.start = start

#font json format
class FontJson:
    def __init__(self, id, name, path, height=20, glyphstr="", fontdata=[], glyphs=[]) -> None:
        self.id = id
        self.name = name
        self.path = path
        self.height = height
        self.glyphstr = glyphstr
        self.glyphs = [glyph.__dict__ for glyph in glyphs]
        self.data = fontdata

#font wrapper for PIL
class TrueTypeFontWrapper:
    def __init__(self, font):
        self.font = font

    def getoffset(self, glyph):
        _, (offset_x, offset_y) = self.font.font.getsize(glyph)
        return offset_x, offset_y

    def getmask(self, glyph, **kwargs):
        return self.font.getmask(glyph, **kwargs)

    def getmetrics(self, glyphs):
        return self.font.getmetrics()

#main class, generate all files
class AssetsBuilder:
    yaml_content = None
    def __init__(self, args) -> None:
        self.args = args
        self.name = "stock"
        self.version = "0.0.0"
        self.buildpath = "build/" + self.name
        self.publish = False
        self.description = "A custom asset library"
        self.load_config(args.config)

    def build(self):
        if "library" in self.yaml_content:
            library = self.yaml_content["library"]
            if "name" in library:
                self.name = library["name"]
            if "version" in library:
                self.name = library["version"]
            if "buildpath" in library:
                self.buildpath = library["buildpath"]
            if "publish" in library:
                self.publish = library["publish"]
            if "description" in library:
                self.description = library["description"]
        else:
            print("-> No library in config !")
            return

        #test and make build path if don't exists
        if not os.path.exists(self.buildpath):
            try:
                os.makedirs(self.buildpath)
            except OSError as e:
                print("Error creating path: " + self.buildpath)
                return

        libraryimagesjsons = self.process_folder("images", self.generate_images_json)
        libraryanimationjsons = self.process_folder("animations", self.generate_animations_json)
        libraryfontjsons = self.process_folder("fonts", self.generate_fonts_json)
        libraryscreenjson = self.generate_screen_presets_json()

        libraryfiles = list()

        for libraryjsons in [libraryimagesjsons, libraryanimationjsons, libraryfontjsons, [libraryscreenjson]]:
            if libraryjsons is None:
                continue
            for item in libraryjsons:
                file = {
                    "path": item["path"],
                    "type": item["type"],
                    "size": item["size"]
                }
                #Uppercase first letter of type
                fileType = file["type"][0].upper() + file["type"][1:]
                print(f'-> {fileType} file {file["path"]} generated: {file["size"]/ (1024)} kB')
                libraryfiles.append(file)

        manifestObject = ManifestJson(name=self.name,version=self.version,buildpath=self.buildpath,description=self.description, files=libraryfiles)
        manifestFilename = self.buildpath + "/manifest.json"
        with open(manifestFilename, "w") as manifestFile:
            json.dump(manifestObject.__dict__, manifestFile, indent=4)
            manifestFile.close()

        print("-> Manifest generated: " + manifestFilename)

        if self.publish:
            self.publish_library(self.publish, self.buildpath)

    def publish_library(self, publish, buildpath):
        #deleting destination folder
        if os.path.exists(publish):
            print("-> Deleting " + publish + " folder...")
            shutil.rmtree(publish)
        #copying build folder to destination
        print("-> Copying " + buildpath + " to " + publish + "...")
        shutil.copytree(buildpath, publish)

    def process_folder(self, yaml_content_key, generate_json_func):
        jsonFiles = list()
        if not yaml_content_key in self.yaml_content:
            print("-> No " + yaml_content_key + "!")
            return
        for item in self.yaml_content[yaml_content_key]:
            if "folder" in item is None:
                print("no folder in item")
                continue
            foldername = ""
            path = ""
            if "name" in item:
                foldername = item["name"]
            if path == "":
                path = foldername
            if foldername == "":
                print("name not set")
                continue
            buildpath = self.buildpath + "/" + path
            if not os.path.exists(buildpath):
                #print("path does not exist: " + buildpath)
                try:
                    os.makedirs(buildpath)
                except OSError as e:
                    print("Error creating path: " + buildpath)
                    continue
            if not "files" in item:
                print("no files in folder: " + foldername)
                continue
            #print("folder: " + foldername)
            jsonFiles.append(generate_json_func(path, item["files"]))
        return jsonFiles

    def generate_screen_presets_json(self):
        jsonOut = list()
        jsonFile = self.buildpath + '/screen_presets.json'
        for preset in self.yaml_content['screens']:
            name = preset['name']
            colormode = preset['colormode']
            background = preset['background']
            width = preset['width']
            height = preset['height']
            scale = preset['scale']
            showgrid = preset['showgrid']
            gridsize = preset['gridsize']
            jsonOut.append(ScreenPresetJson(name, colormode, background, width, height, scale, showgrid, gridsize))

        folder = dict()
        folder["type"]  = "screens"
        folder["path"]  = 'screen_presets.json'
        folder["files"] = jsonOut
        with open(jsonFile, 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonOut], indent=4)
            outfile.write(jsonStr)
            outfile.close()
            fileSize = os.path.getsize(jsonFile)
            folder["size"] = fileSize
        return folder

    def generate_images_json(self, libpath, filesyaml):
        jsonOut = list()
        jsonFile = self.buildpath + '/' + libpath + '/images.json'
        for image in filesyaml:
            if "include" in image:
                include = image["include"]
                resize = None
                type = None
                if "resize" in image:
                    resize = image["resize"]
                if "type" in image:
                    type = image["type"]
                result = glob.iglob(include, recursive=True)
                for path in result:
                    jsonOut.append(get_image_json(path=path, resize=resize, type=type))
        folder = dict()
        folder["type"]  = "images"
        folder["path"]  = libpath + '/images.json'
        folder["files"] = jsonOut
        with open(jsonFile, 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonOut], indent=4)
            outfile.write(jsonStr)
            outfile.close()
            fileSize = os.path.getsize(jsonFile)
            folder["size"] = fileSize
        return folder

    def generate_animations_json(self, libpath, filesyaml):
        jsonOut = list()
        jsonFile = self.buildpath + '/' + libpath + '/animations.json'
        for animation in filesyaml:
            if "include" in animation:
                include = animation["include"]
                resize = None
                type = None
                if "resize" in animation:
                    resize = animation["resize"]
                if "type" in animation:
                    type = animation["type"]
                result = glob.iglob(include, recursive=True)
                for path in result:
                    jsonOut.append(get_animation_json(path, resize=resize, type = type))
        folder = dict()
        folder["type"]  = "animations"
        folder["path"]  = libpath + '/animations.json'
        folder["files"] = jsonOut
        with open(jsonFile, 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonOut], indent=4)
            outfile.write(jsonStr)
            outfile.close()
            fileSize = os.path.getsize(jsonFile)
            folder["size"] = fileSize
        return folder

    def generate_fonts_json(self, libpath, filesyaml):
        jsonOut = list()
        jsonFile = self.buildpath + '/' + libpath + '/fonts.json'
        for font in filesyaml:
            fontName = font['name']
            fontFile = font['file']
            fontSize = font['size']
            fontGlyphStr = font['glyphs']
            jsonOut.append(get_font_json(fontName, fontFile, fontSize, fontGlyphStr))
        folder = dict()
        folder["type"]  = "fonts"
        folder["path"]  = libpath + '/fonts.json'
        folder["files"] = jsonOut
        with open(jsonFile, 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonOut], indent=4)
            outfile.write(jsonStr)
            outfile.close()
            fileSize = os.path.getsize(jsonFile)
            folder["size"] = fileSize
        return folder

    def load_config(self, configfile = "config/catalog.yaml"):
        from yaml import load, dump
        try:
            from yaml import CLoader as Loader, CDumper as Dumper
        except ImportError:
            from yaml import Loader, Dumper

        yaml_file = open(configfile, 'r')
        self.yaml_content = load(yaml_file, Loader=Loader)

# ttf load wrapper
def load_ttf_font(path, size):
    from PIL import ImageFont
    try:
        font = ImageFont.truetype(str(path), size)
    except Exception as e:
        raise Exception(f"Could not load truetype file {path}: {e}")

    return TrueTypeFontWrapper(font)

#convert a pillow image to a base64 string
def pillow_image_to_base64_string(img):
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

#generate an ESPHome image format json file
def get_image_json(path, resize=None,type=None):
    from PIL import Image

    #file = open(path, 'rb')
    #binary_fc       = file.read()  # fc aka file_content
    #base64_utf8_str = base64.b64encode(binary_fc).decode('utf-8')
    #dataurl = f'data:image/png;base64,{base64_utf8_str}'
    #file.close()


    image = Image.open(path)

    width, height = image.size
    data = []

    if type is None:
        type = ImageType.IMAGE_TYPE_RGB24
    else:
        #parse type from string to enum
        type = IMAGE_TYPE[type]

    if resize is not None:
        #parse resize text  "WIDTHxHEIGHT" and returns a new width.height tuple
        width, height = [int(x) for x in resize.split('x')]
        image.thumbnail([width, height])
        width, height = image.size
    else:
        if width > 500 or height > 500:
            print(
                "The image you requested is very big. Please consider using"
                " the resize parameter."
            )

    dither = Image.NONE

    if type == ImageType.IMAGE_TYPE_GRAYSCALE:
        image = image.convert("L", dither=dither)
        pixels = list(image.getdata())
        data = [0 for _ in range(height * width)]
        pos = 0
        for pix in pixels:
            data[pos] = pix
            pos += 1

    elif type == ImageType.IMAGE_TYPE_RGB24:
        image = image.convert("RGB")
        pixels = list(image.getdata())
        data = [0 for _ in range(height * width * 3)]
        pos = 0
        for pix in pixels:
            data[pos] = pix[0]
            pos += 1
            data[pos] = pix[1]
            pos += 1
            data[pos] = pix[2]
            pos += 1

    elif type == ImageType.IMAGE_TYPE_RGB565:
        image = image.convert("RGB")
        pixels = list(image.getdata())
        data = [0 for _ in range(height * width * 3)]
        pos = 0
        for pix in pixels:
            R = pix[0] >> 3
            G = pix[1] >> 2
            B = pix[2] >> 3
            rgb = (R << 11) | (G << 5) | B
            data[pos] = rgb >> 8
            pos += 1
            data[pos] = rgb & 255
            pos += 1

    elif type == ImageType.IMAGE_TYPE_BINARY:
        image = image.convert("1", dither=dither)
        width8 = ((width + 7) // 8) * 8
        data = [0 for _ in range(height * width8 // 8)]
        for y in range(height):
            for x in range(width):
                if image.getpixel((x, y)):
                    continue
                pos = x + y * width8
                data[pos // 8] |= 0x80 >> (pos % 8)

    elif type == ImageType.IMAGE_TYPE_TRANSPARENT_BINARY or type == ImageType.IMAGE_TYPE_RGBA32:
        image = image.convert("RGBA")
        width8 = ((width + 7) // 8) * 8
        data = [0 for _ in range(height * width8 // 8)]
        for y in range(height):
            for x in range(width):
                if not image.getpixel((x, y))[3]:
                    continue
                pos = x + y * width8
                data[pos // 8] |= 0x80 >> (pos % 8)
    else:
        raise Exception("Unknown image type: " + str(type))

    base64 = pillow_image_to_base64_string(image)
    dataurl = f'data:image/png;base64,{base64}'

    image.close()

    rhs = [HexInt(x) for x in data]
    basename = os.path.basename(path).split('.')[0]
    #replace invalid chars in basename
    cleanname = re.sub('[^0-9a-zA-Z_]', '_', basename)
    id = "img_" + cleanname
    name = basename
    return ImageJson(id, name, path, type, width, height, [], dataurl)

#generate an ESPHome animation format json file
def get_animation_json(path, resize=None, type=None):
    #path = CORE.relative_config_path(config[CONF_FILE])

    file = open(path, 'rb')
    binary_fc       = file.read()  # fc aka file_content
    file.close()
    base64_utf8_str = base64.b64encode(binary_fc).decode('utf-8')
    dataurl = f'data:image/gif;base64,{base64_utf8_str}'

    from PIL import Image
    try:
        image = Image.open(path)
    except Exception as e:
        raise Exception(f"Could not load image file {path}: {e}")

    width, height = image.size
    frames = image.n_frames
    data = None

    if type is None:
        type = ImageType.IMAGE_TYPE_BINARY
    else:
        #parse type from string to enum
        type = IMAGE_TYPE[type]

    if resize is not None:
        #parse resize text  "WIDTHxHEIGHT" and returns a new width.height tuple
        new_width_max, new_height_max = tuple(map(int, resize.split('x')))
        ratio = min(new_width_max / width, new_height_max / height)
        width, height = int(width * ratio), int(height * ratio)
    else:
        if width > 500 or height > 500:
            print(
                "The image you requested is very big. Please consider using"
                " the resize parameter."
            )

    if type == ImageType.IMAGE_TYPE_GRAYSCALE:
        data = [0 for _ in range(height * width * frames)]
        pos = 0
        for frameIndex in range(frames):
            image.seek(frameIndex)
            frame = image.convert("L", dither=Image.NONE)
            if resize is not None:
                frame = frame.resize([width, height])
            pixels = list(frame.getdata())
            if len(pixels) != height * width:
                raise Exception(
                    f"Unexpected number of pixels in {path} frame {frameIndex}: ({len(pixels)} != {height*width})"
                )
            for pix in pixels:
                data[pos] = pix
                pos += 1
    elif type == ImageType.IMAGE_TYPE_RGB24:
        data = [0 for _ in range(height * width * 3 * frames)]
        pos = 0
        for frameIndex in range(frames):
            image.seek(frameIndex)
            if resize is not None:
                image.thumbnail([width, height])
            frame = image.convert("RGB")
            if resize is not None:
                frame = frame.resize([width, height])
            pixels = list(frame.getdata())
            if len(pixels) != height * width:
                raise Exception(
                    f"Unexpected number of pixels in {path} frame {frameIndex}: ({len(pixels)} != {height*width})"
                )
            for pix in pixels:
                data[pos] = pix[0]
                pos += 1
                data[pos] = pix[1]
                pos += 1
                data[pos] = pix[2]
                pos += 1

    elif type == ImageType.IMAGE_TYPE_RGB565:
        data = [0 for _ in range(height * width * 2 * frames)]
        pos = 0
        for frameIndex in range(frames):
            image.seek(frameIndex)
            frame = image.convert("RGB")
            if resize is not None:
                frame = frame.resize([width, height])
            pixels = list(frame.getdata())
            if len(pixels) != height * width:
                raise Exception(
                    f"Unexpected number of pixels in {path} frame {frameIndex}: ({len(pixels)} != {height*width})"
                )
            for pix in pixels:
                R = pix[0] >> 3
                G = pix[1] >> 2
                B = pix[2] >> 3
                rgb = (R << 11) | (G << 5) | B
                data[pos] = rgb >> 8
                pos += 1
                data[pos] = rgb & 255
                pos += 1
    else:
    #elif type == ImageType.IMAGE_TYPE_BINARY:
        width8 = ((width + 7) // 8) * 8
        data = [0 for _ in range((height * width8 // 8) * frames)]
        for frameIndex in range(frames):
            image.seek(frameIndex)
            frame = image.convert("1", dither=Image.NONE)
            if resize is not None:
                frame = frame.resize([width, height])
            for y in range(height):
                for x in range(width):
                    if frame.getpixel((x, y)):
                        continue
                    pos = x + y * width8 + (height * width8 * frameIndex)
                    data[pos // 8] |= 0x80 >> (pos % 8)


    rhs = [HexInt(x) for x in data]
    #print(rhs)

    basename = os.path.basename(path).split('.')[0]
    #replace invalid chars in basename
    cleanname = re.sub('[^0-9a-zA-Z_]', '_', basename)
    id = "anim_" + cleanname
    name = basename
    return AnimationJson(id, name, path,type, width, height, frames, rhs, dataurl)

#generate an ESPHome font format json file
def get_font_json(name, path, size=5, glyphs=' !"%()+=,-.:/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz°'):
    font = load_ttf_font(path, size)
    ascent, descent = font.getmetrics(glyphs)
    glyph_args = {}
    data = []
    for glyph in glyphs:
        mask = font.getmask(glyph, mode="1")
        offset_x, offset_y = font.getoffset(glyph)
        width, height = mask.size
        #width8 = ((width + 7) // 8) * 8
        #glyph_data = [0] * (height * width8 // 8)
        glyph_data = [0] * (height * width)
        for y in range(height):
            for x in range(width):
                if not mask.getpixel((x, y)):
                    continue
                #pos = x + y * width8
                pos = x + y * width
                #glyph_data[pos // 8] |= 0x80 >> (pos % 8)
                glyph_data[pos] = 1

        glyph_args[glyph] = (len(data), offset_x, offset_y, width, height)
        data += glyph_data

    rhs = [HexInt(x) for x in data]

    glyph_initializer = []
    for glyph in glyphs:
        offset_x = glyph_args[glyph][1]
        offset_y = glyph_args[glyph][2]
        width = glyph_args[glyph][3]
        height = glyph_args[glyph][4]
        start = glyph_args[glyph][0]
        glyphobj = FontGlyph(glyph, offset_x, offset_y, width, height, start)
        glyph_initializer.append(glyphobj)

    #id= name of the file without extension
    basename = os.path.basename(path).split('.')[0]
    #replace invalid chars in basename
    basename = re.sub('[^0-9a-zA-Z_]', '_', basename)
    id = "font_" + basename
    return FontJson(id, name, path, size, glyphs, rhs, glyph_initializer)

def validate_pillow_installed():
    try:
        import PIL
    except ImportError as err:
        raise vol.Invalid(
            "Please install the pillow python package to use this feature. "
            "(pip install pillow)"
        ) from err

    if PIL.__version__[0] < "4":
        raise vol.Invalid(
            "Please update your pillow installation to at least 4.0.x. "
            "(pip install -U pillow)"
        )

def main():
    #...
    validate_pillow_installed()

    #get config file from app args
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='config/catalog-stock.yaml', help='config file')
    args = parser.parse_args()

    #build asset library from config
    ab = AssetsBuilder(args)
    ab.build()

main()