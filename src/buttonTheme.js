import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"

const baseStyle = defineStyle({
  background: "#f7f7f7",
  color: "#065BAA",
  fontSize:"14px",
  borderWidth:"0.09375em",
  borderStyle: "solid",
  borderRadius: "5px", // disable the border radius
  fontWeight: "800", // change the font weight to normal
  fontFamily: "Mulish", // change the font family to monospaced
})

const sizes = {
  md: defineStyle({
    fontSize: "sm", // Change font size to sm (14px)
  }),
}

// Defining a custom variant
const customVariant = defineStyle((props) => {
  const { colorScheme: c } = props
  return {
    fontFamily: "Mulish",
    bg: `${c}.500`,
    fontWeight: "semibold",
    color: 'white',
    transition: 'transform 0.15s ease-out, background 0.15s ease-out',
    _dark: {
      bg: `${c}.200`,
      color: 'gray.800',
    },

    _hover: {
      transform: "scale(1.05, 1.05)",
      bg: `${c}.600`,

      _dark: {
        bg: `${c}.300`,
      },
    },

    _active: {
      bg: `${c}.700`,
      transform: "scale(1, 1)",

      _dark: {
        bg: `${c}.400`,
      }
    },
  }
})
const ClaimBtn = defineStyle((props) => {
  const { colorScheme: c } = props
  return {
    fontFamily: "Mulish",
    bg: `#065BAA`,
    fontWeight: "semibold",
    color: 'white',
    transition: 'transform 0.15s ease-out, background 0.15s ease-out',
    _dark: {
      bg: `#054e91`,
      color: 'gray.800',
    },

    _hover: {
      transform: "scale(1.05, 1.05)",
      bg: `#054e91`,

      _dark: {
        bg: `#054e91`,
      },
    },

    _active: {
      bg: `#054e91`,
      transform: "scale(1, 1)",

      _dark: {
        bg: `#054e91`,
      }
    },
  }
})

export const buttonTheme = defineStyleConfig({
  baseStyle,
  sizes,
  variants: {
    "custom": customVariant,
    "base": baseStyle,
    "ClaimBtn":ClaimBtn
  },
  defaultProps: {
    colorScheme: "blue", // set the default color scheme to purple
  },
})