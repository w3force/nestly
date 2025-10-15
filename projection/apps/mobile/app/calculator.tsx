import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, TextInput, Card } from "react-native-paper";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import { simulateDeterministic, useProjectionStore } from "@projection/core";

  const {
    input,
    setInput,
    result,
    setResult,
    loading,
    setLoading,
    reset,
  } = useProjectionStore();

  // Initialize form state from store or defaults
  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);
  const [rate, setRate] = useState(input?.rate ?? 7);

  const handleCalculate = () => {
    setLoading(true);
    const years = retireAge - age;
    const inputObj = {
      age,
      retireAge,
      balance,
      contribution,
      rate,
      inflation: 0,
    };
    setInput(inputObj);
    const projection = simulateDeterministic({
      initialBalance: balance,
      annualContribution: contribution,
      years,
      annualReturn: rate / 100,
      inflation: 0,
    });
    setResult(projection);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="401(k) Calculator" />
        <Card.Content>
          <TextInput
            label="Current Age"
            value={age.toString()}
            keyboardType="numeric"
            onChangeText={v => setAge(Number(v))}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Retirement Age"
            value={retireAge.toString()}
            keyboardType="numeric"
            onChangeText={v => setRetireAge(Number(v))}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Current Balance ($)"
            value={balance.toString()}
            keyboardType="numeric"
            onChangeText={v => setBalance(Number(v))}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Annual Contribution ($)"
            value={contribution.toString()}
            keyboardType="numeric"
            onChangeText={v => setContribution(Number(v))}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Expected Return (%)"
            value={rate.toString()}
            keyboardType="numeric"
            onChangeText={v => setRate(Number(v))}
            style={{ marginBottom: 8 }}
          />
          <Button mode="contained" onPress={handleCalculate} style={{ marginTop: 8 }}>
            Calculate
          </Button>
        </Card.Content>
      </Card>
      {result && (
        <Card>
          <Card.Title title="Projection" />
          <Card.Content>
            <View style={{ height: 200, flexDirection: "row" }}>
              <YAxis
                data={result.nominalBalances}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 10, fill: "#888" }}
                numberOfTicks={6}
                formatLabel={value => `$${Math.round(value)}`}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <LineChart
                  style={{ flex: 1 }}
                  data={result.nominalBalances}
                  svg={{ stroke: "#1976d2", strokeWidth: 2 }}
                  contentInset={{ top: 20, bottom: 20 }}
                  curve={undefined}
                >
                  <Grid />
                </LineChart>
                <XAxis
                  style={{ marginTop: 8 }}
                  data={result.nominalBalances}
                  scale={scale.scaleLinear}
                  formatLabel={(_, i) => (i % 5 === 0 ? age + i : "")}
                  contentInset={{ left: 10, right: 10 }}
                  svg={{ fontSize: 10, fill: "#888" }}
                />
              </View>
            </View>
            <Text style={{ marginTop: 16, fontWeight: "bold" }}>
              Final Balance: ${result.nominalBalances.at(-1).toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}
