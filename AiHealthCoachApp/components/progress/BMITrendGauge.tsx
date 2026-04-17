import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, BMI_COLORS, CHART_COLORS } from '@/constants/theme';
import { getBMICategory } from '@/components/constants/progressData';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  bmi: number;
}

const GAUGE_W = 260;
const GAUGE_H = 150;
const CX = GAUGE_W / 2;
const CY = 120;
const R = 90;
const START_ANGLE = Math.PI;
const END_ANGLE = 0;

// BMI segments: [startBMI, endBMI, colorKey]
const SEGMENTS: [number, number, keyof typeof BMI_COLORS][] = [
  [15, 18.5, 'underweight'],
  [18.5, 25, 'normal'],
  [25, 30, 'overweight'],
  [30, 35, 'obese'],
  [35, 40, 'extremeObese'],
];

const BMI_MIN = 15;
const BMI_MAX = 40;

function bmiToAngle(bmi: number): number {
  const clamped = Math.max(BMI_MIN, Math.min(BMI_MAX, bmi));
  const ratio = (clamped - BMI_MIN) / (BMI_MAX - BMI_MIN);
  return START_ANGLE - ratio * Math.PI;
}

function polarToXY(angle: number, r: number): { x: number; y: number } {
  return { x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) };
}

function arcPath(startBmi: number, endBmi: number): string {
  const a1 = bmiToAngle(startBmi);
  const a2 = bmiToAngle(endBmi);
  const s = polarToXY(a1, R);
  const e = polarToXY(a2, R);
  const largeArc = Math.abs(a1 - a2) > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${R} ${R} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

const BMITrendGauge: React.FC<Props> = ({ bmi }) => {
  const { label, colorKey } = getBMICategory(bmi);
  const needleAngle = bmiToAngle(bmi);
  const needleTip = polarToXY(needleAngle, R - 18);
  const needleBase = polarToXY(needleAngle, 12);

  // Tick marks for key BMI values
  const tickValues = [15, 18.5, 25, 30, 35];

  return (
    <View
      className="mx-5 mb-5 p-5 rounded-2xl"
      style={{ backgroundColor: CHART_COLORS.cardBg, borderWidth: 1, borderColor: CHART_COLORS.cardBorder }}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="speedometer" size={20} color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white }}>
              BMI Trend
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.muted }}>
              {label === 'Normal weight' ? 'Steady improvement' : label}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white }}>
            {bmi.toFixed(1)}
          </Text>
          <Text style={{ fontSize: 11, color: COLORS.muted }}>Current BMI</Text>
        </View>
      </View>

      {/* Gauge */}
      <View className="items-center" style={{ backgroundColor: '#0D0D0D', borderRadius: 12, paddingTop: 16, paddingBottom: 8 }}>
        <Svg width={GAUGE_W} height={GAUGE_H}>
          {/* Arc segments */}
          {SEGMENTS.map(([s, e, ck]) => (
            <Path
              key={ck}
              d={arcPath(s, e)}
              fill="none"
              stroke={BMI_COLORS[ck]}
              strokeWidth={16}
              strokeLinecap="butt"
            />
          ))}

          {/* Tick labels */}
          {tickValues.map((v) => {
            const pos = polarToXY(bmiToAngle(v), R + 16);
            return (
              <SvgText
                key={v}
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fontSize={9}
                fill={CHART_COLORS.axisLabel}
              >
                {v}
              </SvgText>
            );
          })}

          {/* Needle */}
          <Line
            x1={needleBase.x}
            y1={needleBase.y}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={COLORS.white}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Circle cx={CX} cy={CY} r={6} fill={COLORS.white} />
          <Circle cx={CX} cy={CY} r={3} fill={CHART_COLORS.cardBg} />

          {/* Center value */}
          <SvgText
            x={CX}
            y={CY - 20}
            textAnchor="middle"
            fontSize={22}
            fontWeight="bold"
            fill={COLORS.white}
          >
            {bmi.toFixed(1)}
          </SvgText>
        </Svg>

        {/* Label badge */}
        <View
          className="px-4 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(57,255,20,0.12)', marginTop: -8 }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: BMI_COLORS[colorKey] }}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BMITrendGauge;
