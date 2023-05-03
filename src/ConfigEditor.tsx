import React, { ChangeEvent, PureComponent } from 'react';
import { InlineField, InlineSwitch, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

//add usestate for input switch, check state

export class ConfigEditor extends PureComponent<Props, State> {

  onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('value changed', this);
    const { onOptionsChange, options } = this.props;
    let jsonData = { ...options.jsonData, [event.target.name]: event.target.value };
    if (event.target.name == "flattenJson") {
      jsonData["flattenJson"] = event.target.checked;
    }
    console.log(event.target.name, jsonData["flattenJson"]);
    onOptionsChange({ ...options, jsonData });
  };
  
  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <InlineField
            label="Streamr Private Key"
            labelWidth={20}
            tooltip="We do not recommend having amounts of value on this account. Anyone with your private key controls your tokens."
          >
            <Input
              width={70}
              name="privateKey"
              value={jsonData.privateKey || ''}
              onChange={this.onValueChange}
              placeholder="Streamr Private Key"
              spellCheck={false}
              required={true}
              css="css"
            />
          </InlineField>
        </div>

        <div className="gf-form">
          <InlineField label="Streamr Stream ID" labelWidth={20} tooltip="Optional, can be defined as query">
            <Input
              width={70}
              name="streamId"
              value={jsonData.streamId || ''}
              onChange={this.onValueChange}
              placeholder="Streamr Stream ID"
              spellCheck={false}
              css="css"
            />
          </InlineField>
        </div>

        <div className="gf-gorm">
          <InlineField label="Flatten JSON" labelWidth={20} tooltip="Optional, can be defined as query">
            <InlineSwitch 
                label="Flatten JSON"
                name="flattenJson"
                onChange={this.onValueChange}
                value={jsonData.flattenJson}
                css="css"
                />
          </InlineField>
        </div>
      </div>
    );
  }
}
