"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const charData = (size = 20) =>
  Array.from({ length: size }, () => ({
    date: new Date(Date.now() - Math.random() * 10000000000)
      .toISOString()
      .split("T")[0],
    price: Math.random() * 100,
  }))

// a function the generates the ticker data
function generateTickerData() {
  // generate random data for each ticker
  const AAPL = charData()
  const GOOGL = charData()
  const MSFT = charData()
  return {
    AAPL,
    GOOGL,
    MSFT,
  }
}

const chartConfig = {
  AAPL: {
    label: "AAPL",
    color: "hsl(var(--chart-1))",
  },
  GOOGL: {
    label: "GOOGL",
    color: "hsl(var(--chart-2))",
  },
  MSFT: {
    label: "MSFT",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartLineInteractiveWatchlist() {
  const [activeTicker, setActiveTicker] = React.useState("ALL")

  const tickerData = generateTickerData()

  const getPerformance = (
    data: (typeof tickerData)[keyof typeof tickerData]
  ) => {
    const firstPrice = data[0].price
    const lastPrice = data[data.length - 1].price
    return (((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)
  }

  const combinedData = React.useMemo(() => {
    const dates = tickerData.AAPL.map((item) => item.date)
    return dates.map((date) => ({
      date,
      AAPL: tickerData.AAPL.find((item) => item.date === date)?.price,
      GOOGL: tickerData.GOOGL.find((item) => item.date === date)?.price,
      MSFT: tickerData.MSFT.find((item) => item.date === date)?.price,
    }))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>
          Track the performance of your favorite securities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTicker} onValueChange={setActiveTicker}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ALL">ALL</TabsTrigger>
            {Object.keys(tickerData).map((ticker) => (
              <TabsTrigger key={ticker} value={ticker}>
                {ticker}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="ALL">
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(tickerData).map(([ticker, data]) => (
                  <div key={ticker}>
                    <p className="text-lg font-semibold">{ticker}</p>
                    <p className="text-2xl font-bold">
                      ${data[data.length - 1].price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-medium ${Number(getPerformance(data)) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {getPerformance(data)}%
                    </p>
                  </div>
                ))}
              </div>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={combinedData}
                  margin={{
                    left: 0,
                    right: 0,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                        valueFormatter={(value) => `$${value.toFixed(2)}`}
                      />
                    }
                  />
                  {Object.keys(chartConfig).map((ticker) => (
                    <Line
                      key={ticker}
                      dataKey={ticker}
                      type="monotone"
                      stroke={`var(--color-${ticker})`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                  <Legend />
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>
          {Object.entries(tickerData).map(([ticker, data]) => (
            <TabsContent key={ticker} value={ticker}>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      ${data[data.length - 1].price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current Price
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${Number(getPerformance(data)) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {getPerformance(data)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Performance</p>
                  </div>
                </div>
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[200px] w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                      left: 0,
                      right: 0,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          nameKey="price"
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          }}
                          valueFormatter={(value) => `$${value.toFixed(2)}`}
                        />
                      }
                    />
                    <Line
                      dataKey="price"
                      type="monotone"
                      stroke={`var(--color-${ticker})`}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
