/**
 * ==============================================================================
 * DANH SÁCH NGƯỜI NHẬN & LỜI CHÚC CÁ NHÂN HÓA 20/10 (RECIPIENTS.JS)
 * - Tách biệt hoàn toàn dữ liệu 8 người nhận học sinh / sinh viên.
 * - Lời chúc nguyên văn, riêng biệt cho từng người, tập trung vào học tập, thi cử,
 *   bạn bè, ước mơ, tuổi trẻ và niềm vui thanh xuân.
 * - Tích hợp bài hát cá nhân hóa riêng biệt cho từng người từ Downloads\Music.
 * - Định danh ổn định qua thuộc tính `id` và liên kết mật khẩu ngày sinh.
 * ==============================================================================
 */

const RECIPIENTS_DATA = [
  {
    id: "hoang-mai",
    name: "Vũ Hoàng Mai",
    displayName: "Hoàng Mai",
    birthday: "26/11/2003",
    password: "261103",
    pronoun: "chị",
    icon: "💐",
    music: {
      title: "Chờ Chút",
      artist: "CONGB (Tình Hà Say Hi)",
      src: "music/cho-chut.mp3",
      coverEmoji: "💐",
      fileName: "chờ chút.CONGB TINH HÀ SAY HI OFFICIAL VISUALIZER.mp3",
      startTime: 41,
      bestSegment: "Điệp khúc (00:41): 'Chờ anh chút thôi, khi mùa đông vừa sang... Xếp lại hết ngổn ngang'"
    },
    wish: "Chúc chị Mai của em, ngày 20/10 thật vui vẻ, luôn xinh đẹp, rạng rỡ và gặp thật nhiều may mắn. .Mong chị luôn giữ được sự tự tin, có thật nhiều kỷ niệm đẹp trong quãng đời sinh viên và sớm chạm đến những ước mơ của mình nhé! 💐",
    personalWish: "Chúc chị Mai của em, ngày 20/10 thật vui vẻ, luôn xinh đẹp, rạng rỡ và gặp thật nhiều may mắn. .Mong chị luôn giữ được sự tự tin, có thật nhiều kỷ niệm đẹp trong quãng đời sinh viên và sớm chạm đến những ước mơ của mình nhé! 💐",
    cinematicGreeting: "Chúc chị Mai của em, ngày 20/10 thật vui vẻ, luôn xinh đẹp, rạng rỡ và gặp thật nhiều may mắn. .Mong chị luôn giữ được sự tự tin, có thật nhiều kỷ niệm đẹp trong quãng đời sinh viên và sớm chạm đến những ước mơ của mình nhé! 💐",
    endingNote: "Cảm ơn chị Hoàng Mai vì luôn là một người chị tuyệt vời và truyền cảm hứng tích cực cho mọi người."
  },
  {
    id: "tu-phuong",
    name: "Trần Tú Phương",
    displayName: "Tú Phương",
    birthday: "19/08/2003",
    password: "190803",
    pronoun: "chị",
    icon: "🌷",
    music: {
      title: "Chờ Chút",
      artist: "CONGB (Tình Hà Say Hi)",
      src: "music/cho-chut.mp3",
      coverEmoji: "🌷",
      fileName: "chờ chút.CONGB TINH HÀ SAY HI OFFICIAL VISUALIZER.mp3",
      startTime: 41,
      bestSegment: "Điệp khúc (00:41): 'Chờ anh chút thôi, khi mùa đông vừa sang... Xếp lại hết ngổn ngang'"
    },
    wish: "Chúc chị Tú Phương có một ngày 20/10 ngập tràn niềm vui và những điều ngọt ngào. Mong chị có những buổi học đầy năng lượng, những kỳ thi thuận lợi và thật nhiều khoảnh khắc đáng nhớ. Dù đôi lúc việc học có áp lực đến đâu, chị vẫn luôn đủ kiên trì để vượt qua và tự hào về những gì mình đã cố gắng nhé! 🌷",
    personalWish: "Chúc chị Tú Phương có một ngày 20/10 ngập tràn niềm vui và những điều ngọt ngào. Mong chị có những buổi học đầy năng lượng, những kỳ thi thuận lợi và thật nhiều khoảnh khắc đáng nhớ. Dù đôi lúc việc học có áp lực đến đâu, chị vẫn luôn đủ kiên trì để vượt qua và tự hào về những gì mình đã cố gắng nhé! 🌷",
    cinematicGreeting: "Chúc chị Tú Phương có một ngày 20/10 ngập tràn niềm vui và những điều ngọt ngào. Mong chị có những buổi học đầy năng lượng, những kỳ thi thuận lợi và thật nhiều khoảnh khắc đáng nhớ. Dù đôi lúc việc học có áp lực đến đâu, chị vẫn luôn đủ kiên trì để vượt qua và tự hào về những gì mình đã cố gắng nhé! 🌷",
    endingNote: "Cảm ơn chị Tú Phương vì luôn kiên định, nỗ lực và là chỗ dựa tinh thần ấm áp."
  },
  {
    id: "boi-ngan",
    name: "Phạm Bội Ngân",
    displayName: "Bội Ngân",
    birthday: "21/11/2004",
    password: "211104",
    pronoun: "bạn",
    icon: "🌸",
    music: {
      title: "Nàng Thơ",
      artist: "Hoàng Dũng",
      src: "music/nang-tho.mp3",
      coverEmoji: "🌸",
      fileName: "Nàng Thơ Hoàng Dũng Official MV.mp3",
      startTime: 77,
      bestSegment: "Điệp khúc cao trào (01:17): 'Em không là nàng thơ, anh cũng không còn là nhạc sĩ mộng mơ...'"
    },
    wish: "Chúc Bội Ngân 20/10 thật vui vẻ, ngày nào cũng có chuyện hay ho để kể và có thật nhiều lý do để cười. Mong lúc bạn về Việt Nam thực tập thuận lợi sớm ăn được heo sữa giòn tan.Mong tuổi trẻ của bạn lúc nào cũng rực rỡ và đầy những điều bất ngờ dễ thương! 🌸",
    personalWish: "Chúc Bội Ngân 20/10 thật vui vẻ, ngày nào cũng có chuyện hay ho để kể và có thật nhiều lý do để cười. Mong lúc bạn về Việt Nam thực tập thuận lợi sớm ăn được heo sữa giòn tan.Mong tuổi trẻ của bạn lúc nào cũng rực rỡ và đầy những điều bất ngờ dễ thương! 🌸",
    cinematicGreeting: "Chúc Bội Ngân 20/10 thật vui vẻ, ngày nào cũng có chuyện hay ho để kể và có thật nhiều lý do để cười. Mong lúc bạn về Việt Nam thực tập thuận lợi sớm ăn được heo sữa giòn tan.Mong tuổi trẻ của bạn lúc nào cũng rực rỡ và đầy những điều bất ngờ dễ thương! 🌸",
    endingNote: "Cảm ơn bạn Bội Ngân vì những câu chuyện thú vị, nụ cười rạng rỡ và tình bạn đáng trân quý."
  },
  {
    id: "huong-giang",
    name: "Vũ Hương Giang",
    displayName: "Hương Giang",
    birthday: "08/11/2004",
    password: "081104",
    pronoun: "bạn",
    icon: "🌻",
    music: {
      title: "Em Bé",
      artist: "AMEE × KARIK",
      src: "music/em-be.mp3",
      coverEmoji: "🌻",
      fileName: "EM BÉ AMEE × KARIK Lyrics.mp3",
      startTime: 48.5,
      bestSegment: "Điệp khúc / Hook (00:48): 'Để anh vẫn luôn gọi em là em bé... Dẫu bốn mươi sáu mươi tám mươi...'"
    },
    wish: "Chúc Hương Giang ngày 20/10 rạng rỡ như ánh nắng và luôn tràn đầy năng lượng tích cực.  Chúc bạn không chỉ đạt được thành tích mình mong muốn mà còn tận hưởng thật trọn vẹn những năm tháng đi học với nhiều tình bạn đẹp và trải nghiệm đáng nhớ nhé! 🌻",
    personalWish: "Chúc Hương Giang ngày 20/10 rạng rỡ như ánh nắng và luôn tràn đầy năng lượng tích cực.  Chúc bạn không chỉ đạt được thành tích mình mong muốn mà còn tận hưởng thật trọn vẹn những năm tháng đi học với nhiều tình bạn đẹp và trải nghiệm đáng nhớ nhé! 🌻",
    cinematicGreeting: "Chúc Hương Giang ngày 20/10 rạng rỡ như ánh nắng và luôn tràn đầy năng lượng tích cực.  Chúc bạn không chỉ đạt được thành tích mình mong muốn mà còn tận hưởng thật trọn vẹn những năm tháng đi học với nhiều tình bạn đẹp và trải nghiệm đáng nhớ nhé! 🌻",
    endingNote: "Cảm ơn bạn Hương Giang vì nguồn năng lượng tươi vui, sự nhiệt huyết và những nụ cười tỏa nắng."
  },
  {
    id: "ngoc-anh",
    name: "Nguyễn Ngọc Ánh",
    displayName: "Ngọc Ánh",
    birthday: "25/07/2005",
    password: "250705",
    pronoun: "em",
    icon: "💗",
    music: {
      title: "Cupid",
      artist: "FIFTY FIFTY (피프티피프티)",
      src: "music/cupid.mp3",
      coverEmoji: "💗",
      fileName: "FIFTY FIFTY 피프티피프티 Cupid Official MV.mp3",
      startTime: 42,
      bestSegment: "Điệp khúc (00:42): 'I gave a second chance to Cupid... But now, I'm left here feelin' stupid'"
    },
    wish: "Chúc em Ngọc Ánh có một ngày 20/10 thật xinh đẹp và ngập tràn yêu thương. Chúc em luôn chăm ngoan, học tập tiến bộ, kiểm tra gặp đề vừa sức và thi cử đạt kết quả thật tốt. Mong em ngày càng tự tin, dũng cảm thử sức với những điều mới mẻ, giữ mãi sự hồn nhiên đáng yêu và từng bước tiến gần hơn đến ước mơ của mình nhé! 💗",
    personalWish: "Chúc em Ngọc Ánh có một ngày 20/10 thật xinh đẹp và ngập tràn yêu thương. Chúc em luôn chăm ngoan, học tập tiến bộ, kiểm tra gặp đề vừa sức và thi cử đạt kết quả thật tốt. Mong em ngày càng tự tin, dũng cảm thử sức với những điều mới mẻ, giữ mãi sự hồn nhiên đáng yêu và từng bước tiến gần hơn đến ước mơ của mình nhé! 💗",
    cinematicGreeting: "Chúc em Ngọc Ánh có một ngày 20/10 thật xinh đẹp và ngập tràn yêu thương. Chúc em luôn chăm ngoan, học tập tiến bộ, kiểm tra gặp đề vừa sức và thi cử đạt kết quả thật tốt. Mong em ngày càng tự tin, dũng cảm thử sức với những điều mới mẻ, giữ mãi sự hồn nhiên đáng yêu và từng bước tiến gần hơn đến ước mơ của mình nhé! 💗",
    endingNote: "Cảm ơn em Ngọc Ánh vì nét hồn nhiên, chăm ngoan và sự nỗ lực không ngừng trong học tập."
  },
  {
    id: "ngoc-mai",
    name: "Nguyễn Ngọc Mai",
    displayName: "Ngọc Mai",
    birthday: "18/04/2005",
    password: "180404",
    altPassword: "180405",
    pronoun: "em",
    icon: "🩷",
    music: {
      title: "Feels",
      artist: "Calvin Harris ft. Pharrell, Katy Perry, Big Sean",
      src: "music/feels.m4a",
      coverEmoji: "🩷",
      fileName: "Calvin Harris-Feels Nguyen Ngoc Mai.m4a",
      startTime: 53,
      bestSegment: "Điệp khúc (00:53): 'Don't be afraid to catch feels, ride drop top and chase thrills...'"
    },
    wish: "20/10 vui vẻ nha em Ngọc Mai! Chúc em có thật nhiều niềm vui ở trường, gặp được những người bạn chân thành và luôn có người đồng hành mỗi khi học tập mệt mỏi. Mong những đêm ôn bài đều được đền đáp bằng kết quả xứng đáng, những ước mơ em ấp ủ ngày càng gần hơn và thanh xuân của em sẽ đầy ắp tiếng cười cùng những kỷ niệm đẹp. 🩷",
    personalWish: "20/10 vui vẻ nha em Ngọc Mai! Chúc em có thật nhiều niềm vui ở trường, gặp được những người bạn chân thành và luôn có người đồng hành mỗi khi học tập mệt mỏi. Mong những đêm ôn bài đều được đền đáp bằng kết quả xứng đáng, những ước mơ em ấp ủ ngày càng gần hơn và thanh xuân của em sẽ đầy ắp tiếng cười cùng những kỷ niệm đẹp. 🩷",
    cinematicGreeting: "20/10 vui vẻ nha em Ngọc Mai! Chúc em có thật nhiều niềm vui ở trường, gặp được những người bạn chân thành và luôn có người đồng hành mỗi khi học tập mệt mỏi. Mong những đêm ôn bài đều được đền đáp bằng kết quả xứng đáng, những ước mơ em ấp ủ ngày càng gần hơn và thanh xuân của em sẽ đầy ắp tiếng cười cùng những kỷ niệm đẹp. 🩷",
    endingNote: "Cảm ơn em Ngọc Mai vì sự chín chắn, chân thành và những kỷ niệm học trò thật đẹp."
  },
  {
    id: "khanh-huyen",
    name: "Hoàng Thị Khánh Huyền",
    displayName: "Khánh Huyền",
    birthday: "15/10/2007",
    password: "151007",
    pronoun: "em",
    icon: "🎀",
    music: {
      title: "Nếu Tình Yêu Quên Lãng (如果爱忘了)",
      artist: "Uông Tô Lang & Đơn Y Thuần (汪苏泷 & 单依纯)",
      src: "music/neu-tinh-yeu-quen-lang.mp3",
      coverEmoji: "🎀",
      fileName: "【黑胶无损】｜ 汪苏泷 单依纯《 如果爱忘了》把深情演绎的淋漓尽致 声生不息家年华 InfinityAndBeyond MangoTV.mp3",
      startTime: 49,
      bestSegment: "Điệp khúc (00:49): 'Nếu tình yêu lãng quên, nước mắt chẳng muốn rơi (如果爱忘了泪不想落下)...'"
    },
    wish: "Chúc em Khánh Huyền ngày 20/10 thật đáng yêu và nhận được thật nhiều lời chúc tốt đẹp. Chúc em đi học mỗi ngày đều có niềm vui, kết bạn được với những người tốt, ngày càng trưởng thành và luôn tin vào khả năng của bản thân. Mong em có những kỳ thi thật suôn sẻ, luôn giữ vững tinh thần khi gặp khó khăn và sau này nhìn lại sẽ thấy quãng đời đi học của mình thật đáng nhớ nhé! 🎀",
    personalWish: "Chúc em Khánh Huyền ngày 20/10 thật đáng yêu và nhận được thật nhiều lời chúc tốt đẹp. Chúc em đi học mỗi ngày đều có niềm vui, kết bạn được với những người tốt, ngày càng trưởng thành và luôn tin vào khả năng của bản thân. Mong em có những kỳ thi thật suôn sẻ, luôn giữ vững tinh thần khi gặp khó khăn và sau này nhìn lại sẽ thấy quãng đời đi học của mình thật đáng nhớ nhé! 🎀",
    cinematicGreeting: "Chúc em Khánh Huyền ngày 20/10 thật đáng yêu và nhận được thật nhiều lời chúc tốt đẹp. Chúc em đi học mỗi ngày đều có niềm vui, kết bạn được với những người tốt, ngày càng trưởng thành và luôn tin vào khả năng của bản thân. Mong em có những kỳ thi thật suôn sẻ, luôn giữ vững tinh thần khi gặp khó khăn và sau này nhìn lại sẽ thấy quãng đời đi học của mình thật đáng nhớ nhé! 🎀",
    endingNote: "Cảm ơn em Khánh Huyền vì sự dễ thương, trong sáng và nụ cười rạng rỡ của tuổi học trò."
  },
  {
    id: "thi-sang",
    name: "Nguyễn Thị Sang",
    displayName: "Thị Sang",
    birthday: "12/11/2006",
    password: "121106",
    pronoun: "em",
    icon: "💜",
    music: {
      title: "Tiramisu Cake (Tóc Ngắn)",
      artist: "We Are The Night",
      src: "music/tiramisu-cake.mp3",
      coverEmoji: "💜",
      fileName: "Tiramisu Cake Original Mix.mp3",
      startTime: 43,
      bestSegment: "Điệp khúc / Hook (00:43): 'Tiramisu Cake, Tiramisu Cake... 마치 넌 Tiramisu Cake'"
    },
    wish: "Chúc em Thị Sang một ngày 20/10 thật đặc biệt, luôn vui vẻ, khỏe mạnh và gặp nhiều điều tốt lành. Chúc em học tập thuận lợi, luôn tìm thấy động lực ngay cả khi bài vở nhiều, mạnh dạn theo đuổi điều mình yêu thích và không ngại thử thách bản thân. Mong những nỗ lực hôm nay sẽ giúp em xây dựng một tương lai thật đẹp, với nhiều cơ hội và thành công đang chờ phía trước. 💜",
    personalWish: "Chúc em Thị Sang một ngày 20/10 thật đặc biệt, luôn vui vẻ, khỏe mạnh và gặp nhiều điều tốt lành. Chúc em học tập thuận lợi, luôn tìm thấy động lực ngay cả khi bài vở nhiều, mạnh dạn theo đuổi điều mình yêu thích và không ngại thử thách bản thân. Mong những nỗ lực hôm nay sẽ giúp em xây dựng một tương lai thật đẹp, với nhiều cơ hội và thành công đang chờ phía trước. 💜",
    cinematicGreeting: "Chúc em Thị Sang một ngày 20/10 thật đặc biệt, luôn vui vẻ, khỏe mạnh và gặp nhiều điều tốt lành. Chúc em học tập thuận lợi, luôn tìm thấy động lực ngay cả khi bài vở nhiều, mạnh dạn theo đuổi điều mình yêu thích và không ngại thử thách bản thân. Mong những nỗ lực hôm nay sẽ giúp em xây dựng một tương lai thật đẹp, với nhiều cơ hội và thành công đang chờ phía trước. 💜",
    endingNote: "Cảm ơn em Thị Sang vì sự chăm chỉ, kiên trì và nguồn năng lượng tích cực mỗi ngày."
  }
];

// Xuất ra window để truy cập toàn cục
window.RECIPIENTS_DATA = RECIPIENTS_DATA;
