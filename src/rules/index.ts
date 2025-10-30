import batteriesImage from "../assets/batteries.png";
import circuitBreakerImage from "../assets/circuit-breaker.png";
import powerIndicatorImage from "../assets/power-indicator.png";
import powerSwitchImage from "../assets/power-switch.png";
import replacingBatteriesImage from "../assets/replacing-batteries.png";
import type { Fact } from "../facts";

interface ConditionRule {
  type: "condition";
  condition: (fact: Fact) => boolean;
  patch: Fact;
}

interface QuestionRule {
  type: "question";
  condition: (fact: Fact) => boolean;

  title: string;
  content?: string;
  image?: string;

  options: Array<{
    description: string;
    patch: Fact;
  }>;
}

export type Rule = ConditionRule | QuestionRule;

export const rules: Rule[] = [
  {
    // Initial question: let the user choose the issue encountered
    type: "question",
    condition: (
      fact: Fact, // Rule condition
    ) =>
      fact["projector-turns-on"] === undefined && // 1. None of the four issues are set
      fact["image-displayed"] === undefined &&
      fact["remote-control-works"] === undefined &&
      fact["speaker-works"] === undefined &&
      (fact["done"] === true || fact["done"] === undefined), // 2. Trigger only at the beginning or in DONE state to avoid interference when facts are manually cleared mid-flow
    title: "What is the issue with the projector?",
    options: [
      {
        description: "The projector won't turn on",
        patch: {
          done: false,
          "projector-turns-on": false,
        },
      },
      {
        description: "No image is displayed",
        patch: {
          done: false,
          "image-displayed": false,
        },
      },
      {
        description: "The remote control is not working",
        patch: {
          done: false,
          "remote-control-works": false,
        },
      },
      {
        description: "The speaker is not working",
        patch: {
          done: false,
          "speaker-works": false,
        },
      },
    ],
  },
  {
    // Reset all facts when in DONE state
    type: "condition",
    condition: (fact: Fact) => fact["done"] === true,
    patch: {
      "projector-turns-on": undefined,
      "image-displayed": undefined,
      "remote-control-works": undefined,
      "speaker-works": undefined,
      "power-indicator-on": undefined,
      "power-button-on": undefined,
      "circuit-breaker-on": undefined,
      "input-source-correct": undefined,
      "batteries-functional": undefined,
      "is-muted": undefined,
      "volume-settings-correct": undefined,
      "go-ask-for-it-support": undefined,
    },
  },
  {
    // When entering the go-ask-for-it-support state, directly prompt the user to seek help
    type: "question",
    condition: (fact: Fact) => fact["go-ask-for-it-support"] === true,
    title: "Please ask IT for help.",
    options: [
      {
        description: "Done",
        patch: {
          done: true, // After user confirms, enter DONE state
        },
      },
    ],
  },
  {
    // Enter DONE state if any issue is resolved
    type: "condition",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === true ||
      fact["image-displayed"] === true ||
      fact["remote-control-works"] === true ||
      fact["speaker-works"] === true,
    patch: {
      done: true,
    },
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === false &&
      fact["power-indicator-on"] === undefined,
    title: "Is the power indicator on?",
    image: powerIndicatorImage,
    options: [
      {
        description: "Yes",
        patch: {
          "projector-turns-on": undefined,
          "power-indicator-on": true,
        },
      },
      {
        description: "No",
        patch: {
          "power-indicator-on": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === false &&
      fact["power-indicator-on"] === false &&
      fact["power-button-on"] === undefined,
    title: "Is the power button on?",
    image: powerSwitchImage,

    options: [
      {
        description: "Yes",
        patch: {
          "power-button-on": true,
        },
      },
      {
        description: "No",
        patch: {
          "power-button-on": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["power-button-on"] === false,
    title: "Please turn on the power button. ",
    options: [
      {
        description: "Done",
        patch: {
          "power-indicator-on": undefined,
          "power-button-on": true,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === false &&
      fact["power-indicator-on"] === false &&
      fact["power-button-on"] === true &&
      fact["circuit-breaker-on"] === undefined,
    title: "Is the circuit breaker on?",
    image: circuitBreakerImage,
    options: [
      {
        description: "Yes",
        patch: {
          "circuit-breaker-on": true,
        },
      },
      {
        description: "No",
        patch: {
          "circuit-breaker-on": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["circuit-breaker-on"] === false,
    title: "Please turn on the circuit breaker.",
    options: [
      {
        description: "Done",
        patch: {
          "power-indicator-on": undefined,
          "circuit-breaker-on": true,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === undefined &&
      fact["power-indicator-on"] === true,
    title: "Is the projector turning on?",
    options: [
      {
        description: "Yes",
        patch: {
          "projector-turns-on": true,
        },
      },
      {
        description: "No",
        patch: {
          "projector-turns-on": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["image-displayed"] === false &&
      fact["input-source-correct"] === undefined,
    title: "Is the input source correct?",
    options: [
      {
        description: "Yes",
        patch: {
          "image-displayed": undefined,
          "input-source-correct": true,
        },
      },
      {
        description: "No",
        patch: {
          "input-source-correct": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["input-source-correct"] === false,
    title: "Please correct the input source.",
    options: [
      {
        description: "Done",
        patch: {
          "image-displayed": undefined,
          "input-source-correct": true,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["image-displayed"] === undefined &&
      fact["input-source-correct"] === true,
    title: "Is the image displayed now?",
    options: [
      {
        description: "Yes",
        patch: {
          "image-displayed": true,
        },
      },
      {
        description: "No",
        patch: {
          "image-displayed": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["remote-control-works"] === false &&
      fact["batteries-functional"] === undefined,
    title: "Are the batteries functional?",
    image: batteriesImage,
    options: [
      {
        description: "Yes",
        patch: {
          "remote-control-works": undefined,
          "batteries-functional": true,
        },
      },
      {
        description: "No",
        patch: {
          "batteries-functional": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["batteries-functional"] === false,
    title: "Please replace the batteries.",
    image: replacingBatteriesImage,
    options: [
      {
        description: "Done",
        patch: {
          "remote-control-works": undefined,
          "batteries-functional": true,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["remote-control-works"] === undefined &&
      fact["batteries-functional"] === true,
    title: "Is the remote control working now?",
    options: [
      {
        description: "Yes",
        patch: {
          "remote-control-works": true,
        },
      },
      {
        description: "No",
        patch: {
          "remote-control-works": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["speaker-works"] === false && fact["is-muted"] === undefined,
    title: "Is the speaker muted?",
    options: [
      {
        description: "Yes",
        patch: {
          "is-muted": true,
        },
      },
      {
        description: "No",
        patch: {
          "speaker-works": undefined,
          "is-muted": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["is-muted"] === true,
    title: "Please unmute the speaker.",
    options: [
      {
        description: "Done",
        patch: {
          "speaker-works": undefined,
          "is-muted": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["speaker-works"] === false &&
      fact["volume-settings-correct"] === undefined,
    title: "Are the volume settings correct?",
    options: [
      {
        description: "Yes",
        patch: {
          "speaker-works": undefined,
          "volume-settings-correct": true,
        },
      },
      {
        description: "No",
        patch: {
          "volume-settings-correct": false,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) => fact["volume-settings-correct"] === false,
    title: "Please adjust the volume settings.",
    options: [
      {
        description: "Done",
        patch: {
          "speaker-works": undefined,
          "volume-settings-correct": true,
        },
      },
    ],
  },
  {
    type: "question",
    condition: (fact: Fact) =>
      fact["speaker-works"] === undefined &&
      (fact["is-muted"] === false || fact["volume-settings-correct"] === true),
    title: "Is the speaker working now?",
    options: [
      {
        description: "Yes",
        patch: {
          "speaker-works": true,
        },
      },
      {
        description: "No",
        patch: {
          "speaker-works": false,
        },
      },
    ],
  },
  {
    type: "condition",
    condition: (fact: Fact) =>
      fact["power-indicator-on"] === false &&
      fact["power-button-on"] === true &&
      fact["circuit-breaker-on"] === true,
    patch: {
      "go-ask-for-it-support": true,
    },
  },
  {
    type: "condition",
    condition: (fact: Fact) =>
      fact["projector-turns-on"] === false &&
      fact["power-indicator-on"] === true,
    patch: {
      "go-ask-for-it-support": true,
    },
  },
  {
    type: "condition",
    condition: (fact: Fact) =>
      fact["image-displayed"] === false &&
      fact["input-source-correct"] === true,
    patch: {
      "go-ask-for-it-support": true,
    },
  },
  {
    type: "condition",
    condition: (fact: Fact) =>
      fact["remote-control-works"] === false &&
      fact["batteries-functional"] === true,
    patch: {
      "go-ask-for-it-support": true,
    },
  },
  {
    type: "condition",
    condition: (fact: Fact) =>
      fact["speaker-works"] === false &&
      fact["is-muted"] === false &&
      fact["volume-settings-correct"] === true,
    patch: {
      "go-ask-for-it-support": true,
    },
  },
];
