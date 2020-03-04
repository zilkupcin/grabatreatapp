import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col
} from "react-native-table-component";
import TextLabel from "../../text/TextLabel";

const ProductExtra = React.memo(({ imperial, data }) => {
  const convertUnits = () => {
    const dataCopy = { ...data };

    dataCopy.tableHead.forEach(head => {
      const headIndex = dataCopy.tableHead.indexOf(head);
      dataCopy.tableHead[headIndex] = head.replace("(cm)", "(inch)");
    });

    dataCopy.tableData.forEach(dataArray => {
      dataArray.forEach(measurement => {
        const measurementIndex = dataArray.indexOf(measurement);
        let size = parseFloat(measurement);
        size = Math.round(size * 0.393701 * 10) / 10;
        dataArray[measurementIndex] = size + "";
      });
    });

    return dataCopy;
  };

  const getFlexArray = () => {
    let flexArray = [];
    for (var i = 0; i < data.tableHead.length - 1; i++) {
      flexArray.push(1);
    }
    return flexArray;
  };

  return (
    <View style={styles.container}>
      <TextLabel title="SIZING CHART" marginBottom={16} />
      <Table
        borderStyle={{
          borderWidth: 1,
          borderColor: "#FF6363"
        }}
      >
        <Row
          data={imperial ? convertUnits().tableHead : data.tableHead}
          style={styles.head}
          textStyle={styles.text}
          flexArr={getFlexArray()}
        />
        <TableWrapper style={styles.wrapper}>
          <Col
            data={data.tableTitle}
            style={styles.title}
            textStyle={styles.text}
          />
          <Rows
            data={imperial ? convertUnits().tableData : data.tableData}
            textStyle={styles.text}
            flexArr={getFlexArray()}
          />
        </TableWrapper>
      </Table>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    marginBottom: 16
  },
  head: {
    backgroundColor: "#FFD4D4"
  },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#fefefe" },
  text: { margin: 6, fontFamily: "roboto_light" }
});

export default ProductExtra;
