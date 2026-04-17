import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, CHART_COLORS } from '@/constants/theme';
import { DAY_LABELS } from '@/components/constants/progressData';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  /** Array of 7 calorie values for the week (0 = not tracked) */
  calories: number[];
}

const CHART_W = 280;
const CHART_H = 160;
const PAD_L = 40;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 24;

const NutritionBalanceChart: React.FC<Props> = ({ calories }) => {
  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const barCount = 7;
  const barGap = 10;
  const barW = (plotW - barGap * (barCount - 1)) / barCount;

  const maxCal = Math.max(...calories, 500); // minimum scale 500
  const roundedMax = Math.ceil(maxCal / 550) * 550;

  // Y-axis ticks
  const yTickCount = 4;
  const yStep = roundedMax / yTickCount;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round(i * yStep),
  );

  const toY = (v: number) =>
    PAD_T + plotH - (v / roundedMax) * plotH;

  return (
    <View
      className="mx-5 mb-5 p-5 rounded-2xl"
      style={{ backgroundColor: CHART_COLORS.cardBg, borderWidth: 1, borderColor: CHART_COLORS.cardBorder }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-1">
        <Ionicons name="nutrition" size={20} color={COLORS.primary} />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white }}>
            Nutrition Balance
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Daily calorie intake</Text>
        </View>
      </View>

      {/* Chart */}
      <View className="items-center mt-3" style={{ backgroundColor: '#0D0D0D', borderRadius: 12, padding: 8 }}>
        <Svg width={CHART_W} height={CHART_H}>
          {/* Grid lines */}
          {yTicks.map((v) => (
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
          {yTicks.map((v) => (
            <SvgText
              key={`yl-${v}`}
              x={PAD_L - 6}
              y={toY(v) + 4}
              textAnchor="end"
              fontSize={9}
              fill={CHART_COLORS.axisLabel}
            >
              {v}
            </SvgText>
          ))}

          {/* Bars */}
          {calories.map((cal, i) => {
            const x = PAD_L + i * (barW + barGap);
            const barH = cal > 0 ? (cal / roundedMax) * plotH : 0;
            const fillColor = cal > 0 ? CHART_COLORS.barHighlight : CHART_COLORS.barFill;

            return (
              <React.Fragment key={i}>
                {/* Background bar */}
                <Rect
                  x={x}
                  y={PAD_T}
                  width={barW}
                  height={plotH}
                  rx={4}
                  fill={CHART_COLORS.barFill}
                  opacity={0.3}
                />
                {/* Filled bar */}
                {cal > 0 && (
                  <Rect
                    x={x}
                    y={PAD_T + plotH - barH}
                    width={barW}
                    height={barH}
                    rx={4}
                    fill={fillColor}
                    opacity={0.85}
                  />
                )}
                {/* X label */}
                <SvgText
                  x={x + barW / 2}
                  y={CHART_H - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill={CHART_COLORS.axisLabel}
                >
                  {DAY_LABELS[i]}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

export default NutritionBalanceChart;
