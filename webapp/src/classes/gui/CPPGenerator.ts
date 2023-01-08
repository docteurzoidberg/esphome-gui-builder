import { GuiElement } from "./GuiElement";

export class CPPLGenerator {
  static generateCPP(elements: GuiElement[]) {
    const filteredElements = elements.filter((_element) => {
      //TODO: filter?
      return true;
    });

    const imageElements = filteredElements.filter((element) => {
      return element.type === "image";
    });
    const animationElements = filteredElements.filter((element) => {
      return element.type === "animation";
    });
    const textElements = filteredElements.filter((element) => {
      return element.type === "text";
    });

    //create sample cpp call for each element
    let cpp = "";

    //iterate over all elements with text type
    let fontsCpp = "";
    textElements.forEach((element) => {
      fontsCpp += element.toCPP();
    });
    if (fontsCpp !== "") {
      cpp += "/* fonts */\n" + fontsCpp;
    }

    //iterate over all elements with image type
    let imagesCpp = "";
    imageElements.forEach((element) => {
      imagesCpp += element.toCPP();
    });
    if (imagesCpp !== "") {
      cpp += "/* images */\n" + imagesCpp;
    }

    //iterate over all elements with animation type
    let animationsCpp = "";
    animationElements.forEach((element) => {
      if (element.type === "animation") {
        animationsCpp += element.toCPP();
      }
    });
    if (animationsCpp !== "") {
      cpp += "/* animations */\n" + animationsCpp;
    }

    //empty scene?
    if (cpp === "") {
      cpp =
        "//!\\ Scene is empty, add elements to canvas to generate sample lambda code";
    }

    return cpp;
  }
}
