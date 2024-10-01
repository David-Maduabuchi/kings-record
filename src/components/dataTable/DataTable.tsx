import "./dataTable.scss";

interface Props {
  column: {
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
    col8: string;
    col9: string;
  }[];

  rows: {
    title: string;
    firstName: string;
    lastName: string;
    Date: string;
    email: string;
    phoneNumber: string;
    total: number;
    partnershipsTotal: number;
    givingsTotal: number;
  }[];
}

const DataTable = (props: Props) => {
  if (props.rows.length === 0) {
    return (
      <div className="spread-sheet-no-data">
        <img src="/svg/InvalidGraph.svg" />
        <span>The scrolls have been opened, yet no names were found!</span>
      </div>
    );
  }
  return (
    <div className="dataTableContainer">
      <table className="table ">
        {props.column.map((column, index) => (
          <thead className="thead" key={index}>
            <tr className="tr">
              {/* <th className="th first-row">
                <input
                  style={{
                    cursor: "pointer",
                  }}
                  type="checkbox"
                  className="checkBox"
                />
              </th> */}
              <th className="th second-row">{column.col2}</th>
              <th className="th">{column.col3}</th>
              <th className="th">{column.col4}</th>
              <th className="th fifth-row ">{column.col5}</th>
              <th className="th">{column.col6}</th>
              <th className="th">{column.col7} </th>
              <th className="th">{column.col8}</th>
              <th className="th ninth-row">{column.col9}</th>
              <th className="th icon">
                <img
                  className="verticalDots"
                  src="/svg/verticaldots.svg"
                  alt=""
                />
              </th>
            </tr>
          </thead>
        ))}

        <tbody className="tbody">
          {props.rows.map((row) => (
            <tr className="tr" key={row.email}>
              {/* <td className="td first-row ">
                <input
                  style={{
                    cursor: "pointer",
                  }}
                  type="checkbox"
                  className="checkBox"
                />
              </td> */}
              <td className="td second-row">{row.title}</td>
              <td className="td">{row.lastName}</td>
              <td className="td">{row.firstName}</td>
              <td className="td fifth-row">{row.email}</td>
              <td className="td ">{row.phoneNumber}</td>
              <td className="td">{row.partnershipsTotal}</td>
              <td className="td ">{row.givingsTotal} </td>
              <td className="td ninth-row">{row.total}</td>
              <td className="td icon">
                <img
                  className="verticalDots"
                  src="/svg/verticaldots.svg"
                  alt=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
