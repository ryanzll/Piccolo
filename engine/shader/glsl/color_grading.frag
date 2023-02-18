#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
	highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);

	highp vec4 color       = subpassLoad(in_color).rgba;

	highp vec2 lutSize = vec2(lut_tex_size.x, lut_tex_size.y);

	highp float blockNum = lutSize.x / lutSize.y;

	highp float blockIndexL = floor(color.b * blockNum);
	highp float blockIndexR = ceil(color.b * blockNum);

	highp float lutCoordXL = (blockIndexL * lutSize.y + color.r * lutSize.y) / lutSize.x;
	highp float lutCoordXR = (blockIndexR * lutSize.y + color.r * lutSize.y) / lutSize.x;

	highp float lutCoorY = color.g;

	highp vec2 lutCoordL = vec2(lutCoordXL, lutCoorY);
	highp vec2 lutCoordR = vec2(lutCoordXR, lutCoorY);

	highp vec4 lutcolorL = texture(color_grading_lut_texture_sampler, lutCoordL);
	highp vec4 lutcolorR = texture(color_grading_lut_texture_sampler, lutCoordR);

	highp float weight = fract(color.b * lutSize.y);

	out_color = mix(lutcolorL, lutcolorR, weight);  
}
