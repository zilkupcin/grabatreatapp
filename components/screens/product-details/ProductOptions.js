import React from "react";
import OptionSelector from "./OptionSelector";

const ProductOptions = React.memo(
  ({ variants, selectedOptions, filteredValues, onOptionSelect }) => {
    return variants[0].options.map((option, index) => {
      return (
        <OptionSelector
          name={option.name}
          key={option.name}
          variants={variants}
          optionIndex={index}
          onOptionSelect={onOptionSelect}
          selectedOptions={selectedOptions}
          filteredValues={index === 1 && filteredValues}
          key={index}
        />
      );
    });
  }
);

export default ProductOptions;
