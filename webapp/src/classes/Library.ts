export type LibraryManifestFile = {
  path: string;
  type: string;
  size: number;
};

export type LibraryManifest = {
  name: string;
  version: string;
  buildpath: string;
  files: LibraryManifestFile[];
};

export type LibraryFile = {
  path: string;
  type: string;
  size: number;
  data: any;
};

export class Library {
  public url: string;
  public manifest?: LibraryManifest;
  public files: LibraryFile[];

  public constructor(url: string) {
    this.url = url;
    this.files = [];
  }

  async fetchManifest(): Promise<LibraryManifest | undefined> {
    //first fetch the library's manifest.json
    const libraryManifestUrl = this.url + "/manifest.json";
    const manifestData = await fetch(libraryManifestUrl);
    try {
      this.manifest = await manifestData.json();
      console.log("manifest " + this.url + " loaded", this.manifest);
    } catch (e) {
      console.error(e);
    }
    return this.manifest;
  }

  async fetchFiles(): Promise<LibraryFile[]> {
    const files: LibraryFile[] = [];
    //then fetch each file in the library
    if (!this.manifest) return files;
    for (const file of this.manifest.files) {
      const fileUrl =
        this.url + "/" + file.path + "?v=" + this.manifest.version;
      try {
        const fileType = file.type;
        const fileData = await fetch(fileUrl);
        //test if http errors
        if (fileData.status === 404 || fileData.status === 500) {
          console.error("Error loading file " + fileUrl);
          continue;
        }
        const fileJson = await fileData.json();
        files.push({
          path: file.path,
          type: fileType,
          size: file.size,
          data: fileJson,
        } as LibraryFile);
        console.log(fileType + " file " + fileUrl + " loaded");
        //console.dir(fileJson);
      } catch (error) {
        console.error(error);
      }
    }
    this.files = files;
    return files;
  }
}
