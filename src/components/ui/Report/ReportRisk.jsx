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
  E: {
    label: "E[W]",
    color: "blue",
  },
  Q: {
    label: "Q[W]",
    color: "red",
  },
  randW: {
    label: "Random (W_T)",
    color: "gray",
  },
  W_F: {
    label: "W_F",
    color: "black",
  },
};
export function ReportRisk({ title, subtitle, data }) {
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
                tickLine={false}
                axisLine={false}
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
                dataKey="W_F"
                type="monotoneX"
                stroke="var(--color-W_F)"
                strokeWidth={1}
                dot={false}
              />
              <Line
                dataKey="randW"
                type="monotoneX"
                stroke="var(--color-randW)"
                strokeWidth={1}
                dot={false}
              />
              <Line
                dataKey="E"
                type="monotoneX"
                stroke="var(--color-E)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                dataKey="Q"
                type="monotoneX"
                stroke="var(--color-Q)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
