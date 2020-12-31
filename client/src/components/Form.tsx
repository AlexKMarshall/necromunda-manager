import {
  Box,
  Heading,
  FormControl as ChakraFormControl,
  Stack,
} from "@chakra-ui/react";

type FormProps = { heading?: string } & React.ComponentProps<"form">;

export function Form({ heading, children, ...rest }: FormProps) {
  return (
    <Box p={4}>
      <form {...rest}>
        <Stack spacing={4}>
          {heading ? (
            <Heading size="md" as="h3">
              {heading}
            </Heading>
          ) : null}
          {children}
        </Stack>
      </form>
    </Box>
  );
}

export function FormControl(
  props: React.ComponentProps<typeof ChakraFormControl>
) {
  const { children, ...rest } = props;
  return (
    <ChakraFormControl {...rest}>
      <Stack spacing={2}>{children}</Stack>
    </ChakraFormControl>
  );
}
