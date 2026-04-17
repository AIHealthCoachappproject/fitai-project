import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, CHART_COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface WeeklyAvg {
  weekLabel: string;
  avgWeight: number;
}

interface Props {
  data: WeeklyAvg[];
  totalChange: number;
}

const CHART_W = 280;
const CHART_H = 140;
const PAD_L = 35;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 24;

const WeightProgressChart: React.FC<Props> = ({ data, totalChange }) => {
  if (data.length === 0) {
    return (
      <View
        className="mx-5 mb-5 p-5 rounded-2xl"
        style={{ backgroundColor: CHART_COLORS.cardBg, borderWidth: 1, borderColor: CHART_COLORS.cardBorder }}
      >
        <View className="flex-row items-center mb-1">
          <Ionicons name="trending-down" size={20} color={COLORS.primary} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white, marginLeft: 8 }}>
            Weight Progress
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>
          last 6 week
        </Text>
        <View className="items-center justify-center" style={{ height: 120 }}>
          <Text style={{ color: COLORS.muted, fontSize: 13 }}>
            Complete your first week to see the chart
          </Text>
        </View>
      </View>
    );
  }

  const weights = data.map((d) => d.avgWeight);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);
  const rangeW = maxW - minW || 1;

  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;

  const toX = (i: number) => PAD_L + (i / (data.length - 1 || 1)) * plotW;
  const toY = (v: number) => PAD_T + plotH - ((v - minW) / rangeW) * plotH;

  // Build SVG path
  let linePath = `M ${toX(0)} ${toY(weights[0])}`;
  for (let i = 1; i < weights.length; i++) {
    linePath += ` L ${toX(i)} ${toY(weights[i])}`;
  }
  const areaPath =
    linePath +
    ` L ${toX(weights.length - 1)} ${PAD_T + plotH}` +
    ` L ${toX(0)} ${PAD_T + plotH} Z`;

  // Y-axis ticks
  const yTicks = 4;
  const yStep = rangeW / yTicks;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) =>
    parseFloat((minW + i * yStep).toFixed(0)),
  );

  const changeLabel =
    totalChange > 0 ? `+${totalChange} Kg` : `${totalChange} Kg`;
  const changeDesc = totalChange > 0 ? 'total gain' : 'total loss';

  return (
    <View
      className="mx-5 mb-5 p-5 rounded-2xl"
      style={{ backgroundColor: CHART_COLORS.cardBg, borderWidth: 1, borderColor: CHART_COLORS.cardBorder }}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-1">
        <View className="flex-row items-center">
          <Ionicons name="trending-down" size={20} color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white }}>
              Weight Progress
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.muted }}>
              last {data.length} week
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white }}>
            {changeLabel}
          </Text>
          <Text style={{ fontSize: 11, color: COLORS.muted }}>{changeDesc}</Text>
        </View>
      </View>

      {/* Chart */}
      <View className="items-center mt-3" style={{ backgroundColor: '#0D0D0D', borderRadius: 12, padding: 8 }}>
        <Svg width={CHART_W} height={CHART_H}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={CHART_COLORS.areaFill} stopOpacity="0.35" />
              <Stop offset="1" stopColor={CHART_COLORS.areaFill} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {yLabels.map((v) => (
            <Line
              key={v}
              x1={PAD_L}
              y1={toY(v)}
              x2={CHART_W - PAD_R}
              y2={toY(v)}
              stroke={CHART_COLORS.gridLine}
              strokeWidth={0.5}
            />
          ))}

          {/* Y labels */}
          {yLabels.map((v) => (
            <SvgText
              key={`yl-${v}`}
              x={PAD_L - 6}
              y={toY(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill={CHART_COLORS.axisLabel}
            >
              {v}
            </SvgText>
          ))}

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <Path d={linePath} fill="none" stroke={CHART_COLORS.areaStroke} strokeWidth={2} />

          {/* X labels */}
          {data.map((d, i) => (
            <SvgText
              key={d.weekLabel}
              x={toX(i)}
              y={CHART_H - 4}
              textAnchor="middle"
              fontSize={9}
              fill={CHART_COLORS.axisLabel}
            >
              {d.weekLabel}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  );
};

export default WeightProgressChart;
