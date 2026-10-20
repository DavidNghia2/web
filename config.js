/**
 * ==============================================================================
 * FILE CẤU HÌNH NỘI DUNG (CONFIG.JS)
 * Dễ dàng tùy chỉnh mọi thông tin của website chúc mừng 20/10 tại đây.
 * Không cần sửa code trong index.html!
 * ==============================================================================
 */

const APP_CONFIG = {
  // 1. THÔNG TIN CHUNG
  title: "Happy Vietnamese Women's Day 20/10",
  groupName: "Hội Chị Em Tuyệt Vời", // Tên nhóm / tập thể chị em
  eventDate: "20 / 10",

  // 2. MÀN HÌNH 1: WELCOME
  welcome: {
    badge: "🌸 Chúc Mừng Ngày Phụ Nữ Việt Nam 🌸",
    headline: "Happy Vietnamese Women's Day!",
    dateHighlight: "20 / 10",
    subtext: "Có một món quà nho nhỏ dành tặng những bông hoa xinh đẹp nhất hôm nay...",
    exploreButtonText: "Khám phá món quà 🌷",
    scrollHint: "Bấm nút hoặc cuộn xuống để tiếp tục"
  },

  // 3. MÀN HÌNH 2: MAGICAL FLOWER GARDEN
  garden: {
    badge: "✨ Khu Vườn Kỳ Diệu ✨",
    heading: "Vườn Hoa Yêu Thương",
    quoteLine1: "Mỗi người phụ nữ đều là một bông hoa mang vẻ đẹp riêng.",
    quoteLine2: "Và hôm nay, khu vườn này dành riêng cho các chị em!",
    interactionHint: "Chạm vào khu vườn hoặc nhân vật mầm cây để gieo thêm những đóa hoa neon rực rỡ nhé!",
    nextButtonText: "Xem những lời chúc yêu thương 💌"
  },

  // 4. MÀN HÌNH 3: SPECIAL WISHES (LỜI CHÚC XUẤT HIỆN LẦN LƯỢT)
  specialWishes: {
    badge: "💌 Lời Chúc Gửi Trao",
    heading: "Những Điều Tuyệt Vời Nhất Dành Cho Chị Em",
    wishesList: [
      {
        icon: "🌸",
        text: "Chúc các chị em luôn xinh đẹp, rạng rỡ và tự tin theo cách riêng của mình."
      },
      {
        icon: "💖",
        text: "Chúc mọi người luôn có thật nhiều sức khỏe, niềm vui và hạnh phúc."
      },
      {
        icon: "☀️",
        text: "Mong rằng mỗi ngày đều có những lý do nhỏ bé khiến mọi người mỉm cười."
      },
      {
        icon: "👭",
        text: "Chúc hội chị em luôn đoàn kết, yêu thương và cùng nhau tạo nên thật nhiều kỷ niệm đẹp."
      },
      {
        icon: "🌷",
        text: "Không chỉ riêng ngày 20/10, mong mọi người luôn được yêu thương và trân trọng trong suốt 365 ngày."
      }
    ],
    nextButtonText: "Xem lại kỷ niệm chúng mình 📸"
  },

  // 5. MÀN HÌNH 4: OUR MEMORIES (ALBUM ẢNH POLAROID)
  // Bạn có thể thêm, bớt hoặc thay đổi link ảnh và chú thích tùy ý!
  memories: {
    badge: "📸 Kỷ Niệm Thân Thương",
    heading: "Những Khoảnh Khắc Đẹp Của Chúng Mình",
    description: "Nhấp vào từng bức ảnh Polaroid để xem phóng to nhé!",
    photos: [
      {
        url: "images/memories/photo-01.jpg",
        caption: "Dưới bầu trời đêm, nụ cười của chúng mình là ngọn nến sáng nhất.",
        date: "Sinh nhật ấm áp"
      },
      {
        url: "images/memories/photo-02.jpg",
        caption: "Tuổi trẻ này thật rực rỡ vì luôn có các bạn ở bên cùng thổi nến ước mơ.",
        date: "Thanh xuân rực rỡ"
      },
      {
        url: "images/memories/photo-03.jpg",
        caption: "Thêm một tuổi mới, mong chúng mình mãi giữ trọn nụ cười hồn nhiên và ngọt ngào này!",
        date: "Khoảnh khắc ngọt ngào"
      },
      {
        url: "images/memories/photo-04.jpg",
        caption: "Gửi trọn một 'trái tim to bự' và sự chân thành đến hội chị em nhân ngày 20/10!",
        date: "Bắn tim to bự"
      },
      {
        url: "images/memories/photo-05.jpg",
        caption: "Những buổi dã ngoại gió lộng, cùng nhau chia sẻ từng que xiên nướng ấm nồng.",
        date: "Dã ngoại kỷ niệm"
      },
      {
        url: "images/memories/photo-06.jpg",
        caption: "Ba bông hoa rạng rỡ giữa đồi cỏ xanh — chúc các nàng lúc nào cũng yêu đời như thế!",
        date: "Hội chị em lung linh"
      },
      {
        url: "images/memories/photo-07.jpg",
        caption: "Đằng sau bữa tiệc dã ngoại luôn là những 'đầu bếp' tận tâm nhất quả đất!",
        date: "Bếp nướng dã ngoại"
      },
      {
        url: "images/memories/photo-08.jpg",
        caption: "Hai chú 'khủng long' dễ thương nhất phòng KTX — bên nhau là chẳng sợ mùa đông lạnh.",
        date: "KTX ấm áp"
      },
      {
        url: "images/memories/photo-09.jpg",
        caption: "Tiệc sinh nhật giản dị trên sàn phòng KTX, nhưng tình cảm thì luôn đong đầy vô bờ.",
        date: "Kỷ niệm KTX"
      },
      {
        url: "images/memories/photo-10.jpg",
        caption: "Căn bếp KTX nhỏ bé nhưng luôn rộn rã tiếng cười và ngập tràn mùi vị yêu thương.",
        date: "Bếp ấm sinh viên"
      },
      {
        url: "images/memories/photo-11.jpg",
        caption: "Những buổi cùng nhau dạo siêu thị, mua vài món lặt vặt thôi cũng đủ vui cả ngày.",
        date: "Hội bạn thân lấp lánh"
      },
      {
        url: "images/memories/photo-12.jpg",
        caption: "Gia đình nhỏ nơi giảng đường — mỗi người một chiếc vương miện, cùng nhau tỏa sáng.",
        date: "Chúng mình là một nhà"
      },
      {
        url: "images/memories/photo-13.jpg",
        caption: "Nồi lẩu cay nồng bốc khói, câu chuyện rôm rả và tình bạn thì mãi ấm áp theo thời gian.",
        date: "Bữa tiệc sum vầy"
      },
      {
        url: "images/memories/photo-14.jpg",
        caption: "Hái những trái dâu ngọt lành nhất, gom nhặt những ngày tháng thanh xuân đẹp đẽ nhất.",
        date: "Mùa dâu ngọt ngào"
      },
      {
        url: "images/memories/photo-15.jpg",
        caption: "Những đêm hóng gió ban công, kể nhau nghe trăm ngàn câu chuyện không đầu không cuối.",
        date: "Ban công đêm muộn"
      }
    ],
    nextButtonText: "Gửi gắm lời chúc cuối cùng 💌"
  },

  // 6. MÀN HÌNH 5: ENDING (TRÁI TIM CÁNH HOA & LỜI CẢM ƠN)
  ending: {
    badge: "🌷 Lời Nhắn Gửi Yêu Thương 🌷",
    title: "Happy Women's Day 20/10 🌷",
    thankYou: "Cảm ơn những người phụ nữ tuyệt vời vì đã luôn mang đến thật nhiều năng lượng tích cực, sự ấm áp và những nụ cười.",
    wishes: "Chúc hội chị em mãi xinh đẹp, hạnh phúc và luôn tỏa sáng!",
    randomWishButtonText: "Nhận thêm một lời chúc 🎁",
    replayButtonText: "Xem lại từ đầu ✨"
  },

  // 7. DANH SÁCH LỜI CHÚC NGẪU NHIÊN KHI BẤM NÚT
  randomWishes: [
    "🌷 Chúc bạn hôm nay nhận được thật nhiều hoa, nhiều quà và ngập tràn lời khen ngợi!",
    "✨ Chúc bạn luôn giữ vững nguồn năng lượng tích cực, nụ cười tỏa nắng đốn tim mọi ánh nhìn!",
    "🧋 Chúc công việc thuận buồm xuôi gió, KPI vượt chỉ tiêu và trà sữa ngập tràn mỗi chiều!",
    "💖 Chúc bạn luôn được yêu thương vô điều kiện, được che chở và tôn trọng mỗi ngày trong năm!",
    "🍀 Chúc ví tiền lúc nào cũng rủng rỉnh, mua sắm không cần nhìn giá, du lịch muôn nơi!",
    "👑 Chúc bạn luôn là phiên bản độc nhất vô nhị, tự tin làm chủ cuộc sống và tỏa sáng rực rỡ!",
    "🌻 Chúc mọi ước mơ dự định của bạn trong năm nay đều sẽ sớm trở thành hiện thực rực rỡ!"
  ],

  // 8. CẤU HÌNH NHẠC NỀN
  // Bạn có thể điền đường dẫn file mp3 online hoặc file lưu cùng thư mục (ví dụ: 'music/bg-music.mp3')
  // Nếu để trống (""), website sẽ tự động tạo giai điệu du dương bằng Web Audio API nội tại!
  bgMusic: {
    enabled: true,
    url: "", // Để trống để dùng giai điệu piano/kalimba tự sinh của website
    title: "Giai điệu yêu thương 20/10"
  }
};

// Xuất ra phạm vi toàn cục để file script.js truy cập dễ dàng
window.APP_CONFIG = APP_CONFIG;
