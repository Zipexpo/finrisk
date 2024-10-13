"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { extent, scaleLinear } from "d3";
const chartConfig = {};
const colorScale = scaleLinear()
  .domain([0, 2000, 4000]) // Input range (min, mid, max)
  .range(["#ffc658", "#82ca9d", "#8884d8"]); // Output colors
export function ReportHist({ title, subtitle, data }) {
  const dataout = React.useMemo(() => {
    const dataout = [...data];
    const color = scaleLinear()
      .domain(extent(data, (d) => d.y)) // Input range (min, mid, max)
      .range(["#ffc658", "#8884d8"]);
    dataout.forEach((d) => (d.fill = color(d.y)));
    return dataout;
  }, [data]); // Output colors
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mx-auto w-full h-full overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <BarChart width={500} height={400} data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                tickLine={false}
                // axisLine={false}
                // type="number"
                // domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => `${Math.round(value * 1000) / 10}%`}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value * 1000) / 10}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v, name, item) =>
                      `${Math.round(v * 10000) / 100}%`
                    }
                  />
                }
              />
              <Bar dataKey="y" />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
