import { theme as origTheme, extendTheme } from '@chakra-ui/react';
import { headingTheme } from './headingTheme';
import { buttonTheme } from './buttonTheme';
import { inputTheme } from './inputTheme';
import { StepsTheme } from 'chakra-ui-steps';
import '@fontsource/mulish/800.css';
import '@fontsource/mulish/700.css';

// const CustomSteps = {
//   ...Steps,
//   baseStyle: props => {
//     return {
//       ...Steps.baseStyle(props),
//       icon: {
//         ...Steps.baseStyle(props).icon,
//         // your custom styles here
//         strokeWidth: '1px',
//       },
//     };
//   },
// };
const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-13px)',
  color: '#065baa',
  fontSize: '12px',
  fontStyle: 'italic',
};

const breakpoints = {
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
};

const spacing = {
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
};
const Select = {
  parts: ['field', 'icon'],
  baseStyle: {
    field: {
      color: '#231f20ab',
      fontSize: '12px',
      background: 'whiteAlpha.100',
      border: '1px dashed',
      borderColor: 'purple.200',
      borderRadius: 'full',
      _focusWithin: {
        ringColor: 'purple.200',
        ring: '2px',
        ringOffset: '1px',
        ringOffsetColor: 'purple.100',
        borderColor: 'purple.50',
      },
      _hover: {
        bg: 'gray.200',
        _dark: {
          bg: 'whiteAlpha.100',
        },
      },
      _focusVisible: {
        background: 'gray.200',
        borderBottom: '1px solid #231F20',
        _dark: {
          background: 'whiteAlpha.100',
        },
      },
      _dark: {
        background: 'gray.600',
      },
    },
    icon: {
      width: '1rem',
      fontSize: '1.5rem',
    },
  },
};

const defaultTheme = extendTheme({
  useSystemColorMode: false,
  fonts: {
    body: 'Mulish',
    Heading: 'Mulish',
    Text: 'Mulish',
  },
  styles: {
    global: () => ({
      body: {
        bg: '#f7f7f7',
      },
    }),
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  breakpoints,
  ...spacing,
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: '2',
    3: '.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  colors: {
    primary: {
      main: '#065BAA',
    },
    secondary: {
      // 500: "rgb(248, 209, 47)",
      500: '#c101e4',
    },
  },

  components: {
    Heading: headingTheme,
    Button: buttonTheme,
    Input: inputTheme,
    Steps: StepsTheme,
    // CustomSteps,
    Select,
    Table: {
      variants: {
        mytable: {
          tr: {
            _odd: {
              background: 'green.500',
            },
          },
        },
      },
    },
    FormControl: {
      variants: {
        customFloatingLabel: {
          label: {
            position: 'absolute',
            top: '-10px', // Adjust the top value as needed
            fontSize: '16px', // Adjust the font size as needed
            color: 'red', // Customize the label color
          },
        },
      },
    },

    Alert: {
      variants: {
        subtle: (props) => {
          // only applies to `subtle` variant
          const { colorScheme: c } = props;
          if (c !== 'red') {
            // use original definition for all color schemes except "blue"
            return origTheme.components.Alert.variants.subtle(props);
          }
          return {
            container: {
              bg: '#065BAA', // or literal color, e.g. "#0984ff"
            },
          };
        },
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: '0px',
              left: 0,
              zIndex: 2,
              fontSize: '11px',
              fontStyle: 'italic',
              position: 'absolute',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
  },
});

export { defaultTheme };
