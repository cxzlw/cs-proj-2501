export type FactKey =
  // 四个故障
  | "projector-turns-on"
  | "image-displayed"
  | "remote-control-works"
  | "speaker-works"

  // 投影仪 fact
  | "power-indicator-on"
  | "power-button-on"
  | "circuit-breaker-on"

  // 显示 fact
  | "input-source-correct"

  // 遥控器 fact
  | "batteries-functional"

  // 音响 fact
  | "is-muted"
  | "volume-settings-correct"

  // 特殊状态
  | "go-ask-for-it-support"
  | "done";

export type FactValue = boolean | undefined;
export type Fact = Partial<Record<FactKey, FactValue>>;

export const Facts = {
  BEFORE_CHECK_INTERNET_CONNECTION: {} as Fact,
  WITHOUT_INTERNET_CONNECTION: {
    "internet-connected": false,
  } as Fact,
  WITH_INTERNET_CONNECTION: {
    "internet-connected": true,
  } as Fact,
  PROJECTOR_WONT_TURN_ON: {
    "projector-turns-on": false,
  } as Fact,
  POWER_INDICATOR_OFF: {
    "projector-turns-on": false,
    "power-indicator-on": false,
  } as Fact,
  POWER_BUTTON_OFF: {
    "projector-turns-on": false,
    "power-indicator-on": false,
    "power-button-on": false,
  } as Fact,
  POWER_INDICATOR_OFF_POWER_BUTTON_ON: {
    "projector-turns-on": false,
    "power-indicator-on": false,
    "power-button-on": true,
  } as Fact,
  CIRCUIT_BREAKER_OFF: {
    "projector-turns-on": false,
    "power-indicator-on": false,
    "power-button-on": true,
    "circuit-breaker-on": false,
  } as Fact,
  CIRCUIT_BREAKER_ON: {
    "projector-turns-on": false,
    "power-indicator-on": false,
    "power-button-on": true,
    "circuit-breaker-on": true,
  } as Fact,
  POWER_INDICATOR_ON_PROJECTOR_OFF: {
    "projector-turns-on": false,
    "power-indicator-on": true,
  } as Fact,
  NO_IMAGE_DISPLAYED: {
    "projector-turns-on": true,
    "image-displayed": false,
  } as Fact,
  REMOTE_CONTROL_NOT_WORKING: {
    "remote-control-works": false,
  } as Fact,
  SPEAKER_NOT_WORKING: {
    "projector-turns-on": true,
    "speaker-works": false,
  } as Fact,
  ALL_FUNCTIONAL: {
    "internet-connected": true,
    "projector-turns-on": true,
    "image-displayed": true,
    "remote-control-works": true,
    "speaker-works": true,
  } as Fact,
} as const;

console.log(Facts.ALL_FUNCTIONAL["power-indicator-on"]);
