import voluptuous as vol
import base64
import glob
import json
import os
import shutil

class HexInt(int):
    def __str__(self):
        value = self
        sign = "-" if value < 0 else ""
        value = abs(value)
        if 0 <= value <= 255:
            return f"{sign}0x{value:02X}"
        return f"{sign}0x{value:X}"

class ImageJson:
    def __init__(self, name, width, height, dataurl) -> None:
        self.name = name
        self.width = width
        self.height = height
        self.dataurl = dataurl

class AnimationJson:
    def __init__(self, name, width, height, frames, data, dataurl) -> None:
        self.name = name
        self.width = width
        self.height = height
        self.frames = frames
        self.data = data
        self.dataurl = dataurl

class FontGlyph:
    def __init__(self, glyph, offset_x, offset_y, width, height, start) -> None:
        self.glyph = glyph
        self.offset_x = offset_x
        self.offset_y = offset_y
        self.width = width
        self.height = height
        self.start = start

class FontJson:
    def __init__(self, name, path, height=20, glyphstr="", fontdata=[], glyphs=[]) -> None:
        self.name = name
        self.path = path
        self.height = height
        self.glyphstr = glyphstr
        self.glyphs = [glyph.__dict__ for glyph in glyphs]
        self.data = fontdata

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

class AssetsBuilder:
    yaml_content = None
    def __init__(self) -> None:
        self.load_config()
        self.generate_images_json()
        self.generate_animations_json()
        self.generate_fonts_json()

    def generate_images_json(self):
        jsonout = list()
        images = self.yaml_content["images"]
        for image in images:
            if "include" in image:
                include = image["include"]
                result = glob.iglob(include, recursive=True)
                for path in result:
                    jsonout.append(get_image_json(path))
        with open('data/images.json', 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonout], indent=4)
            outfile.write(jsonStr)
            outfile.close()
        return jsonout

    def generate_animations_json(self):
        jsonout = list()
        animations = self.yaml_content["animations"]
        for animation in animations:
            if "include" in animation:
                include = animation["include"]
                result = glob.iglob(include, recursive=True)
                for path in result:
                    jsonout.append(get_animation_json(path))

        with open('data/animations.json', 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonout], indent=4)
            outfile.write(jsonStr)
            outfile.close()
            #print(jsonStr)
        return jsonout

    def generate_fonts_json(self):
        jsonout = list()
        for font in self.yaml_content['fonts']:
            fontName = font['name']
            fontFile = font['file']
            fontSize = font['size']
            fontGlyphStr = font['glyphs']
            jsonout.append(get_font_json(fontName, fontFile, fontSize, fontGlyphStr))
        with open('data/fonts.json', 'w') as outfile:
            jsonStr = json.dumps([obj.__dict__ for obj in jsonout], indent=4)
            outfile.write(jsonStr)
            outfile.close()
        return jsonout

    def load_config(self):
        from yaml import load, dump
        try:
            from yaml import CLoader as Loader, CDumper as Dumper
        except ImportError:
            from yaml import Loader, Dumper

        yaml_file = open("config/catalog.yaml", 'r')
        self.yaml_content = load(yaml_file, Loader=Loader)

def load_ttf_font(path, size):
    from PIL import ImageFont
    try:
        font = ImageFont.truetype(str(path), size)
    except Exception as e:
        raise Exception(f"Could not load truetype file {path}: {e}")

    return TrueTypeFontWrapper(font)

def get_image_json(path):
    from PIL import Image
    file = open(path, 'rb')
    binary_fc       = file.read()  # fc aka file_content
    file.close()
    im = Image.open(path)
    width, height = im.size
    base64_utf8_str = base64.b64encode(binary_fc).decode('utf-8')
    dataurl = f'data:image/png;base64,{base64_utf8_str}'
    file.close()
    return ImageJson(path, width, height, dataurl)

def get_animation_json(path):
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
    data = [0 for _ in range(height * width * 3 * frames)]
    pos = 0
    for frameIndex in range(frames):
        image.seek(frameIndex)
        frame = image.convert("RGB")
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

    rhs = [HexInt(x) for x in data]
    #print(rhs)
    return AnimationJson(path,width, height,frames, rhs, dataurl)

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

    return FontJson(name, path, size, glyphs, rhs, glyph_initializer)

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
    AssetsBuilder()

    file_size = os.path.getsize('data/images.json')
    print(f'images.json is {file_size/ (1024)} kB')
    shutil.copy('data/images.json', 'webapp/public/images.json')

    file_size = os.path.getsize('data/animations.json')
    print(f'animations.json is {file_size/ (1024)} kB')
    shutil.copy('data/animations.json', 'webapp/public/animations.json')

    file_size = os.path.getsize('data/fonts.json')
    print(f'fonts.json is {file_size/ (1024)} kB')
    shutil.copy('data/fonts.json', 'webapp/public/fonts.json')

validate_pillow_installed()
main()