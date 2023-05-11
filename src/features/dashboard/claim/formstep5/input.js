import { useFormContext } from 'react-hook-form';
import React, { useContext } from 'react';
import { Context } from './container';

export const Item = props => {
  const { register } = useFormContext();
  const Ctx = useContext(Context);

  const deleteHandler = () => Ctx.remove(props.pIndex);
  const sizeDefault = 3
  console.log('names', props)
  return (
    <div>
      <label>
        {props.label}
      <input type={props.type} {...register(props.name + props.pIndex)} onChange={props.handleChange}/>
      </label>
      <button type="button" onClick={deleteHandler}>
        Delete
      </button>
    </div>
  );
};
