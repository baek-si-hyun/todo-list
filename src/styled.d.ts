import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    boardColor: string;
    bgColor: string;
    cardColor: string;
    textColor: string;
  }
}
