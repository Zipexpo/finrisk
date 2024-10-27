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
  Line,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
const chartConfig = {
  cc: {
    label: "Cash in Cash Account",
    color: "green",
  },
  cb: {
    label: "Cash in Cash Bank",
    color: "black",
  },
};
export function ReportRetirement({ title, subtitle, data }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mx-auto w-full h-full overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <ComposedChart
              width={500}
              height={400}
              data={data}
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                // tickLine={false}
                // axisLine={false}
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => value}
              />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend className="mt-8" content={<ChartLegendContent />} />
              {/* <Area
                type="monotone"
                dataKey="a"
                stroke="none"
                fill="#cccccc"
                connectNulls
                dot={false}
                activeDot={false}
              /> */}
              <Line
                dataKey="cc"
                type="monotoneX"
                stroke="var(--color-cc)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                dataKey="cb"
                type="monotoneX"
                stroke="var(--color-cb)"
                strokeWidth={1.5}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
