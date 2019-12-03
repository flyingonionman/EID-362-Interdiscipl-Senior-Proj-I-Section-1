import * as React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "../config/colors";

// We support all the TextInput props
type Props = TextInputProps;

class FormTextInput extends React.Component<Props> {
  render() {
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={colors.DODGER_BLUE}
        // Add the externally specified style to our own
        // custom one
        style={[styles.textInput, style]}
        // ...and then spread all the other props
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: colors.SILVER,
    borderBottomWidth: 1,
    marginBottom: 20
  }
});

export default FormTextInput;