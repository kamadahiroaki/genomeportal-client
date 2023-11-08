import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "gray.800",
      },
      p: {
        fontSize: "lg",
        lineHeight: "tall",
      },
    },
  },
  components: {
    Table: {
      parts: ["th"],
      baseStyle: {
        th: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
