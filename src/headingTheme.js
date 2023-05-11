import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"
const brandPrimary = defineStyle({
    color: "#0358a8",
    fontFamily: "Mulish",
    fontWeight: "800",
    fontSize:"24px",
    // let's also provide dark mode alternatives
    _dark: {
        color: 'blue.300',
    }
})

const custom = defineStyle({
    color: "#231F20",
    fontFamily: "Mulish",
    fontWeight: "800",
    fontSize:"12px",
    // let's also provide dark mode alternatives
    _dark: {
        color: 'yellow.300',
    }
})

const underline = defineStyle({
    color: "orange.500",
    borderBottom: "2px",
    borderRadius: "10",
    fontFamily: "Mulish",
    fontWeight:"800",
    // let's also provide dark mode alternatives
    _dark: {
        color: 'orange.400',
    },
    _hover: {
        borderColor: "red.200",
        _dark: {
            borderColor: "red.300"
        }
    }
})

export const headingTheme = defineStyleConfig({
    variants: {
        "primary": brandPrimary,
        "custom": custom,
        "underline": underline
    },
})