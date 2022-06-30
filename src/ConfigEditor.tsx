import React, { ChangeEvent, PureComponent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
    onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { onOptionsChange, options } = this.props;
        const jsonData = { ...options.jsonData, [event.target.name]: event.target.value };

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
            </div>
        );
    }
}
