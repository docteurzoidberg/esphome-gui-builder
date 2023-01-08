import { GuiElement } from "./GuiElement";

export class YAMLGenerator {
  static generateYaml(elements: GuiElement[]) {
    //create esphome yaml for each element
    let yaml = "";

    //filter elements by unique ids
    const uniqueIds = new Set();
    const yamlElements = elements.filter((element) => {
      if (uniqueIds.has(element.esphomeId)) {
        return false;
      }
      uniqueIds.add(element.esphomeId);
      return true;
    });

    const imageElements = yamlElements.filter((element) => {
      return element.type === "image";
    });
    const animationElements = yamlElements.filter((element) => {
      return element.type === "animation";
    });
    const textElements = yamlElements.filter((element) => {
      return element.type === "text";
    });

    //iterate over all elements with text type
    let fontsYaml = "";
    textElements.forEach((element) => {
      fontsYaml += element.toYAML();
    });
    if (fontsYaml !== "") {
      yaml += "fonts:\n" + fontsYaml;
    }

    //iterate over all elements with image type
    let imagesYaml = "";
    imageElements.forEach((element) => {
      imagesYaml += element.toYAML();
    });
    if (imagesYaml !== "") {
      yaml += "images:\n" + imagesYaml;
    }

    //iterate over all elements with animation type
    let animationsYaml = "";
    animationElements.forEach((element) => {
      animationsYaml += element.toYAML();
    });
    if (animationsYaml !== "") {
      yaml += "animations:\n" + animationsYaml;
    }

    if (yaml === "") {
      yaml =
        "#/!\\ Scene is empty, add elements to canvas to generate ESPHome YAML config";
    }

    return yaml;
  }
}
