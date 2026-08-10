from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "research"
OUT.mkdir(parents=True, exist_ok=True)

BG = "#F3EEE5"
INK = "#191816"
CORAL = "#DF6549"
BLUE = "#3158D7"
OLIVE = "#7D8B42"
MUTED = "#6C685F"
WHITE = "#FFFDF8"
GRID = "#D5CEC2"

FONT_PATH = r"C:\Windows\Fonts\Noto Sans SC (TrueType).otf"
BOLD_PATH = r"C:\Windows\Fonts\Noto Sans SC Bold (TrueType).otf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD_PATH if bold else FONT_PATH, size)


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def performance_chart() -> None:
    image = Image.new("RGB", (1600, 900), BG)
    draw = ImageDraw.Draw(image)
    draw.text((90, 55), "模型能识别什么？", font=font(50, True), fill=INK)
    draw.text(
        (90, 125),
        "在 1,696 个测试样本上，模型更擅长确认高意向信号，仍需改善未购买用户识别。",
        font=font(25),
        fill=MUTED,
    )

    labels = ["准确率", "精确率", "召回率", "AUC"]
    values = [67.98, 74, 60, 76.02]
    colors = [BLUE, CORAL, BLUE, CORAL]
    x_start, y_start, bar_width = 205, 245, 610

    for index, (label, value, color) in enumerate(zip(labels, values, colors)):
        y = y_start + index * 125
        draw.text((90, y + 12), label, font=font(26, True), fill=INK)
        rounded(draw, (x_start, y, x_start + bar_width, y + 62), 18, WHITE, GRID, 2)
        rounded(
            draw,
            (x_start, y, x_start + int(bar_width * value / 100), y + 62),
            18,
            color,
        )
        value_text = f"{value:.2f}%" if value not in (74, 60) else f"{int(value)}%"
        draw.text((x_start + bar_width + 24, y + 10), value_text, font=font(29, True), fill=INK)

    draw.text((90, 760), "测试集指标（%）", font=font(22), fill=MUTED)
    draw.text((965, 210), "两个真正显著的行为信号", font=font(31, True), fill=INK)

    cards = [
        (
            "加购次数",
            "+5.6%",
            "每增加 1 次加购，购买优势约提升 5.6%",
            "OR = 1.056 · p < .001",
            CORAL,
        ),
        (
            "品类多样性",
            "+1.3%",
            "每多接触 1 个品类，购买优势约提升 1.3%",
            "OR = 1.013 · p < .001",
            BLUE,
        ),
    ]
    for index, (title, big, description, footnote, color) in enumerate(cards):
        y = 290 + index * 235
        rounded(draw, (950, y, 1510, y + 190), 28, WHITE, INK, 2)
        draw.text((990, y + 28), title, font=font(25, True), fill=INK)
        text_width = draw.textbbox((0, 0), big, font=font(40, True))[2]
        draw.text((1470 - text_width, y + 20), big, font=font(40, True), fill=color)
        draw.text((990, y + 88), description, font=font(21), fill=MUTED)
        draw.text((990, y + 138), footnote, font=font(20, True), fill=color)

    draw.text(
        (950, 785),
        "浏览次数、收藏次数：控制其他变量后未达到显著水平",
        font=font(20),
        fill=MUTED,
    )
    image.save(OUT / "research-performance.png", quality=95)


def segmentation_chart() -> None:
    image = Image.new("RGB", (1600, 900), BG)
    draw = ImageDraw.Draw(image)
    draw.text((90, 52), "从行为信号到运营动作", font=font(50, True), fill=INK)
    draw.text(
        (90, 125),
        "只跟踪“加购次数”和“品类多样性”，即可形成低成本的三级意向分层。",
        font=font(25),
        fill=MUTED,
    )

    tiers = [
        (
            "高意向",
            "加购次数 ≥ 2",
            "目标：扫清支付障碍，加快转化",
            "限时催付 · 凑单免邮 · 关联推荐",
            CORAL,
        ),
        (
            "中意向",
            "加购 = 1，或加购 = 0 且品类多样性 ≥ 中位数",
            "目标：强化兴趣，推动首次加购或支付",
            "降价提醒 · 热销榜单 · 加购立减",
            BLUE,
        ),
        (
            "低意向",
            "加购 = 0 且品类多样性 < 中位数",
            "目标：长期培育，避免过度促销打扰",
            "首单权益 · 签到积分 · 内容触达",
            OLIVE,
        ),
    ]

    for index, (title, rule, goal, action, color) in enumerate(tiers):
        y = 215 + index * 215
        rounded(draw, (90, y, 1510, y + 170), 28, WHITE, INK, 2)
        rounded(draw, (120, y + 35, 340, y + 135), 24, color)
        title_box = draw.textbbox((0, 0), title, font=font(32, True))
        title_width = title_box[2] - title_box[0]
        title_height = title_box[3] - title_box[1]
        draw.text(
            (230 - title_width / 2, y + 85 - title_height / 2),
            title,
            font=font(32, True),
            fill="white",
        )
        draw.text((390, y + 30), rule, font=font(25, True), fill=INK)
        draw.text((390, y + 75), goal, font=font(22), fill=MUTED)
        draw.text((390, y + 119), action, font=font(23, True), fill=color)

    image.save(OUT / "research-segmentation.png", quality=95)


if __name__ == "__main__":
    performance_chart()
    segmentation_chart()
    print(OUT / "research-performance.png")
    print(OUT / "research-segmentation.png")
