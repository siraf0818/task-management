import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { idID } from "@mui/material/locale";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

declare module "@mui/material/styles" {
  interface Palette {
    bolddanger: Palette["primary"];
    greyc4: Palette["primary"];
    lightblue: Palette["primary"];
    buttonblue: Palette["primary"];
    buttonyellow: Palette["primary"];
    buttonred: Palette["primary"];
    buttongreen: Palette["primary"];
    lightwarning: Palette["primary"];
    lighterror: Palette["primary"];
  }
  interface PaletteOptions {
    bolddanger: PaletteOptions["primary"];
    greyc4: PaletteOptions["primary"];
    lightblue: PaletteOptions["primary"];
    buttonblue: PaletteOptions["primary"];
    buttonyellow: PaletteOptions["primary"];
    buttonred: PaletteOptions["primary"];
    buttongreen: PaletteOptions["primary"];
    lightwarning: PaletteOptions["primary"];
    lighterror: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    bolddanger: true;
    greyc4: true;
    lightblue: true;
    buttonblue: true;
    buttonyellow: true;
    buttonred: true;
    buttongreen: true;
    lightwarning: true;
    lighterror: true;
  }
}

// Create a theme instance.
const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#252525",
        contrastText: "#fff",
      },
      secondary: {
        main: "#2f2f2f",
      },
      error: {
        main: "#ED4521",
      },
      bolddanger: {
        main: "#E52828",
      },
      greyc4: {
        main: "#C4C4C4",
        contrastText: "#fff",
      },
      lightblue: {
        main: "#1976D2",
      },
      buttonblue: {
        main: "#0A5BBB",
        contrastText: "#fff",
      },
      buttonyellow: {
        main: "#E4D318",
        contrastText: "#fff",
      },
      buttonred: {
        main: "#FF7373",
        contrastText: "#fff",
      },
      buttongreen: {
        main: "#119C5B",
        contrastText: "#fff",
      },
      lightwarning: {
        main: "#ED6C02",
        contrastText: "#fff",
      },
      lighterror: {
        main: "#D32F2F",
        contrastText: "#fff",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "16px",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ _, theme }) => ({
            color: theme.palette.primary.main,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "160%",
            textDecorationLine: "underline",
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #A8B4AF",
            color: "#464E4B",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff",
          },
          inputRoot: {
            borderRadius: "8px",
            border: "1px solid #A8B4AF",
          },
          popupIndicator: {
            "& svg": {
              "& path": {
                d: "path('M7.41 8.57996L12 13.17L16.59 8.57996L18 9.99996L12 16L6 9.99996L7.41 8.57996Z')",
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              border: "1px solid #A8B4AF",
              borderRadius: "8px",
            },
            "& .MuiInputBase-root": {
              color: "#464E4B",
            },
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: ({ _, theme }) => ({
            "& .MuiButtonGroup-grouped": {
              border: `2px solid ${theme.palette.primary.main}`,
            },
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ _, theme }) => ({
            borderRadius: "8px",
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            "&.Mui-selected": {
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
            },
          }),
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: ExpandMoreIcon,
        },
      },
    },
  },

  idID
);

export default theme;
