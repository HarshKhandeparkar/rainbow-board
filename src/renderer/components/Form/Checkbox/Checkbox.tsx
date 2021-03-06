import React from 'react';

import { Icon } from '../../Icon/Icon';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './Checkbox.scss'

export interface ICheckboxProps {
  /** Label text for the checkbox */
  label: string | JSX.Element,
  onInput: (value: boolean) => void,
  defaultValue: boolean,
  /** Info tooltip text */
  info?: string
}

export function Checkbox(props: ICheckboxProps) {
  const { label, onInput, defaultValue, info } = props;

  return (
    <div className="row">
      <div className="col s4 valign-wrapper form-col">
        <label>
          {label}
          {info ?
            <Icon
              customColor={true}
              options={{
                title: info,
                icon: faInfoCircle,
                size: 'sm',
                style: {marginLeft: '4px'}
              }}
            /> : ':'
          }
        </label>
      </div>
      <div className="col s6">
        <div className="checkbox">
          <input
            type="checkbox"
            defaultChecked={defaultValue}
            onInput={(e) => onInput((e.target as any).checked)}
          />
          <span className="checkmark" />
        </div>
      </div>
    </div>
  )
}
