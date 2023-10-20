import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

// default base style from the Input theme
const baseStyle = definePartsStyle({
  field: {
    width: '100%',
    minWidth: 0,
    outline: 0,
    position: 'relative',
    appearance: 'none',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

const variantOutline = definePartsStyle((props) => {
  return {
    field: {
      fontFamily: 'Mulish', // change font family to mono
      fontsize: '14px',
    },
  };
});

const variantFilled = definePartsStyle((props) => {
  return {
    field: {
      fontWeight: 'semibold', // change font weight to semibold
      fontsize: '14px',
    },
  };
});

// Defining a custom variant
const variantCustom = definePartsStyle((props) => {
  const { colorScheme: c } = props;
  return {
    field: {
      border: '0px solid',
      bg: '#ebebeb',
      borderTopRightRadius: '5px',
      borderBottomRightRadius: '5px',
      color: '#1a202c',
      _dark: {
        bg: 'whiteAlpha.50',
      },

      _hover: {
        bg: 'gray.200',
        _dark: {
          bg: 'whiteAlpha.100',
        },
      },
      _readOnly: {
        boxShadow: 'none !important',
        userSelect: 'all',
      },
      _placeholder: {
        color: '#1a202c85',
        fontSize: '12px',
        fontStyle: 'italic',
      },
      _focusVisible: {
        bg: 'gray.200',
        borderBottom: '1px solid #065baa',
        _dark: {
          bg: '#ebebeb',
        },
      },
    },
    addon: {
      border: '0px solid',
      borderColor: 'transparent',
      borderTopLeftRadius: 'full',
      borderBottomLeftRadius: 'full',
      bg: `${c}.500`,
      color: 'white',
      _dark: {
        bg: `${c}.300`,
        color: `${c}.900`,
      },
    },
    input: {
      position: 'relative',
      top: '5', // Reset top position
    },
    element: {
      bg: 'white',
      rounded: 'full',
      border: '1px solid',
      borderColor: 'gray.100',
      _dark: {
        bg: 'whiteAlpha.50',
        borderColor: 'whiteAlpha.100',
      },
    },
  };
});

const variants = {
  outline: variantOutline,
  filled: variantFilled,
  custom: variantCustom,
};

const size = {
  md: defineStyle({
    fontSize: 'sm',
    px: '4',
    h: '10',
    borderRadius: 'none',
  }),
};

const sizes = {
  md: definePartsStyle({
    field: size.md,
    addon: size.md,
  }),
};

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
});
