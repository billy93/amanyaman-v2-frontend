import React from 'react';
import {useSelector} from 'react-redux'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Item } from './input';
import {defaultForm } from '../createClaimSlice'
export const Context = React.createContext({
  remove: () => {},
  append: () => {}
});

export const InputForm = props => {
  const { control } = useFormContext();
  const defaultForms = useSelector(defaultForm)
  
  const Name = useWatch({
    name: `input.${props.socialIndex}.defaultForm`,
    control
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: `input.${props.socialIndex}.inputs`
  });

  const fieldDefault = [{
			label: "Incident Date",
            type: "date",
            name: "incedentdate",
            placeholder: "Incident Date",
            value: "",
            key:"2"
       		 },
			{
				label: "Receipt Provider",
				type: "text",
				name: "receiptprovider",
				placeholder: "Receipt Provider",
				value: "",
        key:"2"
			},
			{
				label: "IDR",
				type: "number",
				name: "amount",
				placeholder: "IDR",
				value: "",
        key:"2"
			}]
  const addProfileHandler = () => {
    append(
      [...defaultForms[0].inputs,...fieldDefault]
    );
  };

  return (
    <div>
      <Context.Provider value={{ remove }}>
        <h1>{Name}</h1>
        {console.log('fieldss', fields)}
        {console.log('defaultForms', defaultForms)}
        {defaultForms?.input && defaultForms?.input[0].inputs?.map((defaultForm, index) => (
          <Item
            pIndex={index}
            name={`input.${props.pIndex}.inputs.${index}.name`}
            key={defaultForm.id}
            size={defaultForm.length}
            handleChange={(e,defaultForm) =>props.handleChange(e,defaultForm)}
            {...defaultForm}

          />
        ))}
        <button type="button" onClick={addProfileHandler}>
          Add profile
        </button>
      </Context.Provider>
    </div>
  );
};
