import React, { ChangeEvent, PureComponent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;

    onChange({ ...query, [event.target.name]: event.target.value });
    onRunQuery();
  };

  render() {
    const { query } = this.props;

    return (
      <div className="gf-form">
        <>
          <InlineField label="Streamr Stream ID" labelWidth={20}>
            <Input
              width={70}
              name="streamId"
              value={query.streamId || ''}
              onChange={this.onValueChange}
              placeholder="Streamr Stream ID"
              spellCheck={false}
              css="css"
            />
          </InlineField>
        </>
      </div>
    );
  }
}
