import type { LevelData, SaveState } from '../types/game';

export const SAVE_KEY = 'seoul_life_adv_game_v1';

export function getDefaultSaveState(): SaveState {
  return {
    mode: 'ko',
    coins: 0,
    unlocked: 0,
    results: {},
  };
}

export function loadSaveState(): SaveState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return getDefaultSaveState();
    return { ...getDefaultSaveState(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSaveState();
  }
}

export function persistSaveState(state: SaveState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted modes
  }
}

export const LEVELS: LevelData[] = [
  {
    id: '1A',
    nameKo: '1A 집',
    nameEn: '1A Home',
    sceneImage: '/src/assets/images/scene_home_seoul_1795209913423.jpg',
    sceneAlt: 'Warm sunlit Korean home living room with low wooden dining table, rice, and kimchi',
    accentTint: 'from-amber-100 to-orange-100',
    grammar: '입니다, 은/는, 이/가, 에, 에서, 하고, -아/어요',
    story: [
      {
        characterId: 'minjun',
        partnerId: 'sarah',
        who: '민준 (Minjun)',
        partner: '사라 (Sarah)',
        ko: '안녕하세요! 저는 민준입니다. 저는 학생입니다.',
        en: 'Hello! I am Minjun. I am a student.',
      },
      {
        characterId: 'sarah',
        partnerId: 'halmeoni',
        who: '사라 (Sarah)',
        partner: '할머니 (Halmeoni)',
        ko: '집이 정말 예뻐요! 할머니하고 민준이 집에 있어요.',
        en: 'The home is really pretty! Halmeoni and Minjun are at home.',
      },
      {
        characterId: 'halmeoni',
        partnerId: 'sarah',
        who: '할머니 (Halmeoni)',
        partner: '사라 (Sarah)',
        ko: '어서 와요! 오늘 집에서 밥하고 김치를 먹어요.',
        en: 'Welcome! Today we eat rice and kimchi at home.',
      },
    ],
    words: [
      { pic: '🙋', ko: '저', en: 'I / me' },
      { pic: '🎒', ko: '학생', en: 'student' },
      { pic: '🏠', ko: '집', en: 'home' },
      { pic: '🍚', ko: '밥', en: 'rice / meal' },
      { pic: '🥄', ko: '먹어요', en: 'eat' },
    ],
    puzzle: {
      ko: '저는 학생입니다.',
      en: 'I am a student.',
      tokensKo: ['저는', '학생입니다.'],
      tokensEn: ['I', 'am', 'a', 'student.'],
      extraKo: '집에서',
      extraEn: 'home',
      hintKo: '저는 first, then 학생입니다.',
      hintEn: 'Start with "I am", then "a student."',
    },
    listening: [
      {
        ko: '집에서 밥을 먹어요.',
        en: 'I eat rice at home.',
        opts: [
          { ko: '🍚 집에서 밥을 먹어요', en: 'I eat rice at home', ok: true },
          { ko: '🏫 학교에 가요', en: 'I go to school', ok: false },
          { ko: '🚌 버스를 타요', en: 'I ride the bus', ok: false },
        ],
      },
      {
        ko: '저는 민준입니다.',
        en: 'I am Minjun.',
        opts: [
          { ko: '👦 저는 민준입니다', en: 'I am Minjun', ok: true },
          { ko: '👵 할머니입니다', en: 'I am Halmeoni', ok: false },
          { ko: '🍲 음식이 맛있어요', en: 'Food is delicious', ok: false },
        ],
      },
      {
        ko: '민준하고 사라가 집에 가요.',
        en: 'Minjun and Sarah go home.',
        opts: [
          { ko: '🏠 집에 가요', en: 'Minjun and Sarah go home', ok: true },
          { ko: '🏫 교실에 있어요', en: 'They are in the classroom', ok: false },
          { ko: '🌳 공원에서 뛰어요', en: 'They run at the park', ok: false },
        ],
      },
    ],
    speaking: {
      ko: '저는 학생입니다',
      en: 'I am a student',
      kwKo: ['저는', '학생'],
      kwEn: ['i', 'am', 'student'],
    },
    culture: {
      characterId: 'halmeoni',
      who: '할머니 (Halmeoni)',
      tipKo: '한국에서는 할머니께 인사하고, 할머니가 먼저 숟가락을 드신 후 식사해요.',
      tipEn: 'In Korea, bow to Halmeoni and wait for the oldest person to start eating first.',
      qKo: '밥을 먹기 전에 한국에서 어떻게 해야 할까요?',
      qEn: 'Before eating, what do you do in Korea?',
      choices: [
        {
          ko: '🙇 할머니께 인사하고 먼저 드시기를 기다려요',
          en: 'Bow to Halmeoni and wait for her to eat first',
          ok: true,
          fbKo: '정답이에요! 한국에서는 어른을 먼저 공경해요.',
          fbEn: 'Correct! In Korea, respect elders first.',
        },
        {
          ko: '😋 아무도 안 기다리고 혼자 먼저 먹어요',
          en: 'Start eating first without waiting',
          ok: false,
          fbKo: '아쉬워요! 한국에서는 가장 어른이 먼저 드실 때까지 기다려요.',
          fbEn: 'In Korea, wait for the oldest person first.',
        },
      ],
    },
  },
  {
    id: '1B',
    nameKo: '1B 학교',
    nameEn: '1B School',
    sceneImage: '/src/assets/images/scene_school_seoul_1795209913088.jpg',
    sceneAlt: 'Sunny Korean classroom with wooden desks and large windows overlooking a green park',
    accentTint: 'from-emerald-100 to-lime-100',
    grammar: '-았/었어요, 습니다/ㅂ니다, -고 싶어요, -아/어 주세요, -으/ㄴ 후에, -보다',
    story: [
      {
        characterId: 'minjun',
        partnerId: 'sarah',
        who: '민준 (Minjun)',
        partner: '사라 (Sarah)',
        ko: '오늘 학교에서 한국어를 공부합니다.',
        en: 'Today we study Korean at school.',
      },
      {
        characterId: 'sarah',
        partnerId: 'minjun',
        who: '사라 (Sarah)',
        partner: '민준 (Minjun)',
        ko: '어제 책을 읽었어요. 천천히 말해 주세요!',
        en: 'Yesterday I read a book. Please speak slowly!',
      },
      {
        characterId: 'minjun',
        partnerId: 'sarah',
        who: '민준 (Minjun)',
        partner: '사라 (Sarah)',
        ko: '학교에 간 후에, 공원에 가고 싶어요. 공원은 학교보다 더 커요!',
        en: 'After going to school, I want to go to the park. The park is bigger than the school!',
      },
    ],
    words: [
      { pic: '🏫', ko: '학교', en: 'school' },
      { pic: '📖', ko: '책', en: 'book' },
      { pic: '📚', ko: '공부합니다', en: 'study (formal)' },
      { pic: '🌳', ko: '공원', en: 'park' },
      { pic: '🗣️', ko: '말해 주세요', en: 'please speak' },
    ],
    puzzle: {
      ko: '공원은 학교보다 더 커요.',
      en: 'The park is bigger than the school.',
      tokensKo: ['공원은', '학교보다', '더', '커요.'],
      tokensEn: ['The', 'park', 'is', 'bigger', 'than', 'the', 'school.'],
      extraKo: '어제',
      extraEn: 'yesterday',
      hintKo: '공원은 first, then 학교보다 더 커요.',
      hintEn: 'Start with "The park is bigger", then "than the school."',
    },
    listening: [
      {
        ko: '어제 학교에 갔어요.',
        en: 'I went to school yesterday.',
        opts: [
          { ko: '🏫 어제 학교에 갔어요', en: 'I went to school yesterday', ok: true },
          { ko: '🏠 집에 있었어요', en: 'I stayed at home', ok: false },
          { ko: '🍲 식당에 갔어요', en: 'I went to a restaurant', ok: false },
        ],
      },
      {
        ko: '한국어를 배우고 싶어요.',
        en: 'I want to learn Korean.',
        opts: [
          { ko: '🇰🇷 한국어를 배우고 싶어요', en: 'I want to learn Korean', ok: true },
          { ko: '🚌 버스를 놓쳤어요', en: 'I missed the bus', ok: false },
          { ko: '☕ 커피를 안 마셔요', en: 'I do not drink coffee', ok: false },
        ],
      },
      {
        ko: '천천히 말해 주세요.',
        en: 'Please speak slowly.',
        opts: [
          { ko: '🐢 천천히 말해 주세요', en: 'Please speak slowly', ok: true },
          { ko: '🚪 문을 닫아 주세요', en: 'Please close the door', ok: false },
          { ko: '🏃 빨리 가세요', en: 'Please go fast', ok: false },
        ],
      },
    ],
    speaking: {
      ko: '한국어를 공부하고 싶어요',
      en: 'I want to study Korean',
      kwKo: ['한국어', '공부하고', '싶어요'],
      kwEn: ['want', 'study', 'korean'],
    },
    culture: {
      characterId: 'minjun',
      who: '민준 (Minjun)',
      tipKo: '교실에서 선생님께 질문할 때는 손을 들고 "-습니다/ㅂ니다" 또는 "-아/어 주세요"처럼 공손히 말해요.',
      tipEn: 'In Korean classrooms, raise your hand and use polite endings like -습니다 or -아/어 주세요 with teachers.',
      qKo: '수업 중에 선생님께 질문하고 싶어요. 어떻게 할까요?',
      qEn: 'You have a question for the teacher in class. What should you do?',
      choices: [
        {
          ko: '🙋 손을 들고 "선생님, 천천히 말해 주세요."라고 말해요',
          en: 'Raise your hand and politely say "Please speak slowly."',
          ok: true,
          fbKo: '최고예요! 공손한 태도에 선생님이 기쁘게 답해 주셨어요.',
          fbEn: 'Great! Polite classroom manners make teachers happy.',
        },
        {
          ko: '📣 손도 안 들고 큰 소리로 반말해요',
          en: 'Shout loudly without raising your hand',
          ok: false,
          fbKo: '교실에서는 손을 들고 공손하게 말해야 해요!',
          fbEn: 'Raise your hand and speak politely in class.',
        },
      ],
    },
  },
  {
    id: '2A',
    nameKo: '2A 도시',
    nameEn: '2A City',
    sceneImage: '/src/assets/images/scene_city_seoul_1795209913795.jpg',
    sceneAlt: 'Vibrant Seoul street with blue city bus, colorful market awnings, and Namsan Tower',
    accentTint: 'from-sky-100 to-blue-100',
    grammar: '-(으)면, -아서/어서, -(으)ㄹ 수 있어요, -아/어야 돼요, -는데, -아/어 보세요',
    story: [
      {
        characterId: 'sarah',
        partnerId: 'minjun',
        who: '사라 (Sarah)',
        partner: '민준 (Minjun)',
        ko: '시간이 있으면, BICC에 갈 수 있어요?',
        en: 'If we have time, can we go to BICC?',
      },
      {
        characterId: 'minjun',
        partnerId: 'sarah',
        who: '민준 (Minjun)',
        partner: '사라 (Sarah)',
        ko: '네! 버스를 타서 가면 빨라요. 먼저 카드를 찍어야 돼요.',
        en: 'Yes! Taking the bus is fast. First, we have to tap our card.',
      },
      {
        characterId: 'mrkim',
        partnerId: 'sarah',
        who: '김 사장님 (Mr. Kim)',
        partner: '사라 (Sarah)',
        ko: '시장은 사람이 많은데 이 차는 정말 달콤해요. 한번 마셔 보세요!',
        en: 'The market is busy, and this tea is really sweet. Try drinking some!',
      },
    ],
    words: [
      { pic: '🚌', ko: '버스', en: 'bus' },
      { pic: '🏛️', ko: '도시', en: 'city' },
      { pic: '🎫', ko: '표', en: 'ticket' },
      { pic: '🍵', ko: '차', en: 'tea' },
      { pic: '🗺️', ko: '지도', en: 'map' },
    ],
    puzzle: {
      ko: '버스를 타서 공원에 갔어요.',
      en: 'I took the bus and went to the park.',
      tokensKo: ['버스를', '타서', '공원에', '갔어요.'],
      tokensEn: ['I', 'took', 'the', 'bus', 'and', 'went', 'to', 'the', 'park.'],
      extraKo: '내일',
      extraEn: 'tomorrow',
      hintKo: '버스를 타서 first, then 공원에 갔어요.',
      hintEn: 'Start with "I took the bus", then "and went to the park."',
    },
    listening: [
      {
        ko: '시간이 있으면 갈 수 있어요.',
        en: 'If I have time, I can go.',
        opts: [
          { ko: '⏰ 시간이 있으면 갈 수 있어요', en: 'If I have time, I can go', ok: true },
          { ko: '🚫 절대 못 가요', en: 'I can never go', ok: false },
          { ko: '🍚 집에서 자요', en: 'I sleep at home', ok: false },
        ],
      },
      {
        ko: '먼저 표를 사야 돼요.',
        en: 'First, we have to buy a ticket.',
        opts: [
          { ko: '🎫 표를 사야 돼요', en: 'We have to buy a ticket', ok: true },
          { ko: '🍲 밥을 먹어야 돼요', en: 'We have to eat rice', ok: false },
          { ko: '📖 책을 읽어야 돼요', en: 'We have to read a book', ok: false },
        ],
      },
      {
        ko: '이 차를 한번 마셔 보세요.',
        en: 'Please try drinking this tea.',
        opts: [
          { ko: '🍵 이 차를 마셔 보세요', en: 'Please try drinking this tea', ok: true },
          { ko: '🚌 버스를 기다리세요', en: 'Please wait for the bus', ok: false },
          { ko: '🏫 학교에 오세요', en: 'Please come to school', ok: false },
        ],
      },
    ],
    speaking: {
      ko: '버스를 타서 공원에 갔어요',
      en: 'I took the bus and went to the park',
      kwKo: ['버스', '타서', '공원', '갔어요'],
      kwEn: ['took', 'bus', 'park'],
    },
    culture: {
      characterId: 'mrkim',
      who: '김 사장님 (Mr. Kim)',
      tipKo: '한국 가게에서 김 사장님께 물건이나 카드를 주고받을 때는 두 손으로 공손히 받아요.',
      tipEn: 'In Korean shops, use both hands when giving or receiving items and payment from Mr. Kim.',
      qKo: '시장에서 김 사장님이 따뜻한 차를 건네주세요. 어떻게 받을까요?',
      qEn: 'Mr. Kim hands you warm tea at the market. How should you take it?',
      choices: [
        {
          ko: '🙌 두 손으로 공손히 받으며 "감사합니다!"라고 해요',
          en: 'Receive with two hands and say "Thank you!"',
          ok: true,
          fbKo: '완벽해요! 두 손으로 받으면 정중하고 따뜻한 인상을 줘요.',
          fbEn: 'Perfect! Using two hands shows genuine respect.',
        },
        {
          ko: '✋ 말없이 한 손으로 휙 낚아채요',
          en: 'Grab it quickly with one hand without speaking',
          ok: false,
          fbKo: '가게에서는 두 손으로 공손하게 주고받는 게 예절이에요!',
          fbEn: 'Use both hands politely at shops!',
        },
      ],
    },
  },
  {
    id: '2B',
    nameKo: '2B 음식과 친구',
    nameEn: '2B Food & Friends',
    sceneImage: '/src/assets/images/scene_food_friends_1795209912632.jpg',
    sceneAlt: 'Cozy Korean restaurant table with stew, chopsticks neatly on rests, and scenic lake window',
    accentTint: 'from-orange-100 to-rose-100',
    grammar: '-기 때문에, -았으면 좋겠어요, -(으)면 안 돼요, -아/어 본 적이 있어요',
    story: [
      {
        characterId: 'minjun',
        partnerId: 'sarah',
        who: '민준 (Minjun)',
        partner: '사라 (Sarah)',
        ko: '음식이 맛있기 때문에, 이 식당에 다시 가고 싶어요.',
        en: 'Because the food is delicious, I want to go to this restaurant again.',
      },
      {
        characterId: 'halmeoni',
        partnerId: 'sarah',
        who: '할머니 (Halmeoni)',
        partner: '사라 (Sarah)',
        ko: '밥에 젓가락을 꽂으면 안 돼요. 옆에 놓으세요.',
        en: 'You must not stick chopsticks upright in rice. Put them on the side.',
      },
      {
        characterId: 'sarah',
        partnerId: 'minjun',
        who: '사라 (Sarah)',
        partner: '민준 (Minjun)',
        ko: 'Lake Malawi에 가 본 적이 있어요? 내일 날씨가 좋았으면 좋겠어요!',
        en: 'Have you ever been to Lake Malawi? I hope the weather is nice tomorrow!',
      },
    ],
    words: [
      { pic: '🍲', ko: '음식', en: 'food' },
      { pic: '🥢', ko: '젓가락', en: 'chopsticks' },
      { pic: '🏞️', ko: '호수', en: 'lake' },
      { pic: '🎁', ko: '선물', en: 'gift' },
      { pic: '🌕', ko: '추석', en: 'Chuseok' },
    ],
    puzzle: {
      ko: 'Lake Malawi에 가 본 적이 있어요?',
      en: 'Have you ever been to Lake Malawi?',
      tokensKo: ['Lake', 'Malawi에', '가 본', '적이', '있어요?'],
      tokensEn: ['Have', 'you', 'ever', 'been', 'to', 'Lake', 'Malawi?'],
      extraKo: '안 돼요',
      extraEn: 'never',
      hintKo: 'Lake Malawi에 first, then 가 본 적이 있어요?',
      hintEn: 'Start with "Have you ever been", then "to Lake Malawi?"',
    },
    listening: [
      {
        ko: '음식이 맛있기 때문에 다시 가고 싶어요.',
        en: 'Because the food is delicious, I want to go again.',
        opts: [
          { ko: '🍲 음식이 맛있기 때문에 다시 가고 싶어요', en: 'I want to go again because the food is delicious', ok: true },
          { ko: '☔ 비가 와서 집에 있어요', en: 'I stay home because of rain', ok: false },
          { ko: '🚌 버스를 탔어요', en: 'I rode the bus', ok: false },
        ],
      },
      {
        ko: '밥에 젓가락을 꽂으면 안 돼요.',
        en: 'You must not stick chopsticks in rice.',
        opts: [
          { ko: '🥢 밥에 젓가락을 꽂으면 안 돼요', en: 'Do not stick chopsticks in rice', ok: true },
          { ko: '🍵 차를 꼭 마시세요', en: 'Please drink tea', ok: false },
          { ko: '🎁 선물을 열어 보세요', en: 'Please open the gift', ok: false },
        ],
      },
      {
        ko: '내일 날씨가 좋았으면 좋겠어요.',
        en: 'I hope the weather is nice tomorrow.',
        opts: [
          { ko: '☀️ 내일 날씨가 좋기를 바라요', en: 'I hope the weather is nice tomorrow', ok: true },
          { ko: '📚 어제 시험을 봤어요', en: 'I took a test yesterday', ok: false },
          { ko: '🏙️ 도시에 살아요', en: 'I live in the city', ok: false },
        ],
      },
    ],
    speaking: {
      ko: '음식이 맛있기 때문에 다시 가고 싶어요',
      en: 'Because the food is delicious I want to go again',
      kwKo: ['음식', '맛있기', '때문에', '가고', '싶어요'],
      kwEn: ['because', 'food', 'delicious', 'again'],
    },
    culture: {
      characterId: 'halmeoni',
      who: '할머니 (Halmeoni)',
      tipKo: '한국에서는 젓가락을 밥에 세워 꽂으면 안 되며, 추석 같은 명절에는 선물을 두 손으로 전하며 인사를 나눠요.',
      tipEn: 'Never stick chopsticks upright in rice in Korea, and offer holiday gifts warmly with both hands.',
      qKo: '식당에서 젓가락을 잠시 내려놓을 때 어디에 두어야 할까요?',
      qEn: 'At a Korean restaurant, where should you put your chopsticks while resting?',
      choices: [
        {
          ko: '🥢 그릇 옆 식탁이나 수저받침에 나란히 놓아요',
          en: 'Place them neatly beside the bowl or on the rest',
          ok: true,
          fbKo: '정답이에요! 한국 식사 예절을 완벽히 익혔어요!',
          fbEn: 'Correct! You mastered Korean dining etiquette!',
        },
        {
          ko: '🍚 밥그릇 한가운데에 똑바로 꽂아요',
          en: 'Stick them straight up in the bowl of rice',
          ok: false,
          fbKo: '밥에 젓가락을 세워 꽂으면 안 돼요! 옆에 놓아 주세요.',
          fbEn: 'Never stick chopsticks upright in rice. Put them on the side!',
        },
      ],
    },
  },
];
