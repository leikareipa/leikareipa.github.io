"use strict";

import { is_defined, ll_assert_native_type } from "../../assert.js";
import { LL_Backend } from "../../backend.js";
export function CreateNewListButton(props = {}) {
  CreateNewListButton.validate_props(props);
  const [currentStep, setCurrentStep] = React.useState("1");
  const [newListKeys, setNewListKeys] = React.useState(0);
  React.useEffect(() => {
    if (newListKeys) {
      if (currentStep === "2" && is_defined(newListKeys.editKey) && is_defined(newListKeys.viewKey)) {
        setCurrentStep("3");
      } else {
        setCurrentStep("fail");
      }
    }
  }, [newListKeys]);
  React.useEffect(() => {
    switch (currentStep) {
      case "2":
        {
          (async () => {
            const keys = await LL_Backend.create_new_list();

            if (keys) {
              setNewListKeys(keys);
            } else {
              setCurrentStep("fail");
            }
          })();

          break;
        }

      case "3":
        {
          if (!is_defined(newListKeys.editKey) || !is_defined(newListKeys.viewKey)) {
            setCurrentStep("fail");
          }

          break;
        }

      default:
        break;
    }
  }, [currentStep]);
  const stepElements = {
    "1": React.createElement("div", null, "Luo uusi lista"),
    "2": React.createElement("div", null, React.createElement("i", {
      className: "fas fa-spinner fa-spin fa-lg",
      style: {
        marginLeft: "-16px",
        marginRight: "16px"
      }
    }), "Luodaan uutta listaa, odotahan..."),
    "3": React.createElement("div", null, "Luotiin uusi lista! Nappaa ", React.createElement("a", {
      href: `./muokkaa/${newListKeys.editKey}`,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "linkki"), " talteen."),
    "fail": React.createElement("div", null, React.createElement("i", {
      className: "fas fa-times fa-lg",
      style: {
        marginLeft: "-16px",
        marginRight: "16px"
      }
    }), "Uutta listaa ei voitu luoda!")
  };
  return React.createElement("div", {
    className: "CreateNewListButton"
  }, React.createElement("div", {
    className: `button step-${currentStep}`,
    onClick: () => {
      if (currentStep === "1") setCurrentStep("2");
    }
  }, stepElements[currentStep] || React.createElement(React.Fragment, null)));
}

CreateNewListButton.validate_props = function (props) {
  ll_assert_native_type("object", props);
  return;
};