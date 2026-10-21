import type { EchoItem } from '../data/types';
type Question = [string, string, string, string, string];
/** Original, deterministic assessment content. First option is the key before rotation.
 * All three questions are independent; feedback is shown only after submission. */
const content: Record<string, { passage: string; questions: [Question, Question, Question] }> = {
  evidence: {
    passage:
      'Mara noticed the library lights were off, but a line of neighbors waited at the door. She set a box of donated books on the steps. “We can read out here,” she said, opening the first book. Soon the neighbors sat beside her.',
    questions: [
      [
        'Which detail best supports the idea that Mara takes initiative?',
        'She begins reading on the steps.',
        'The library lights are off.',
        'Neighbors stand in a line.',
        'The box contains books.',
      ],
      [
        'Which evidence shows that the neighbors accept Mara’s idea?',
        'The neighbors sit beside her.',
        'The library is closed.',
        'Mara notices the lights.',
        'Mara carries a box.',
      ],
      [
        'Which claim is best supported by the passage?',
        'Mara finds a way to bring readers together.',
        'Mara owns the library.',
        'The neighbors dislike books.',
        'The library will never reopen.',
      ],
    ],
  },
  inference: {
    passage:
      'Every afternoon, Ben checked the empty bird feeder. On Saturday he filled it with seeds and moved his chair to the window. He kept his camera within reach.',
    questions: [
      [
        'What can you infer about Ben?',
        'He hopes to photograph birds.',
        'He is afraid of birds.',
        'He wants to sell his camera.',
        'He plans to move away.',
      ],
      [
        'Why does Ben place his chair by the window?',
        'To watch the feeder without disturbing birds.',
        'To block the sunlight.',
        'To hide the seeds.',
        'To repair the window.',
      ],
      [
        'Which detail most strongly supports an interest in observing wildlife?',
        'He keeps his camera near the feeder’s view.',
        'It is Saturday.',
        'He has a chair.',
        'He goes outside.',
      ],
    ],
  },
  context: {
    passage:
      'The trail was arduous: steep slopes and loose rocks made every step difficult. At the top, the hikers found a tranquil lake, with no sound except a soft breeze. Their water was scarce; only a few drops remained.',
    questions: [
      [
        'What does arduous mean here?',
        'Demanding much effort.',
        'Easy to finish.',
        'Full of flowers.',
        'Impossible to see.',
      ],
      [
        'Which phrase clarifies tranquil?',
        'No sound except a soft breeze.',
        'Steep slopes.',
        'Loose rocks.',
        'Every step difficult.',
      ],
      [
        'What does scarce mean in this passage?',
        'Available in very small amounts.',
        'Very cold.',
        'Easy to replace.',
        'Full of minerals.',
      ],
    ],
  },
  punctuation: {
    passage:
      'An editor is checking descriptions for coordinate adjectives: adjectives of equal importance that independently describe a noun.',
    questions: [
      [
        'Which sentence is punctuated correctly?',
        'It was a long, exhausting hike.',
        'It was a long exhausting, hike.',
        'It was, a long exhausting hike.',
        'It was a, long, exhausting hike.',
      ],
      [
        'Which pair of adjectives needs a comma?',
        'A quiet peaceful room.',
        'Three red apples.',
        'A small wooden chair.',
        'Two young birds.',
      ],
      [
        'Why does “a bright, cheerful room” take a comma?',
        'Both adjectives independently describe the room.',
        'Every pair of adjectives takes a comma.',
        'Bright is a noun.',
        'Cheerful modifies bright.',
      ],
    ],
  },
  mainidea: {
    passage:
      'City trees offer shade that cools sidewalks. Their roots absorb rainwater, reducing runoff. Leaves also capture some air pollutants. Planting trees can improve several parts of urban life.',
    questions: [
      [
        'What is the central idea?',
        'Trees benefit cities in several ways.',
        'Trees only provide shade.',
        'Cities have no rain.',
        'Leaves are difficult to clean.',
      ],
      [
        'Which detail supports the central idea?',
        'Roots absorb rainwater.',
        'Trees appear in many stories.',
        'Some sidewalks are gray.',
        'People wear hats in summer.',
      ],
      [
        'Which detail would best extend this passage?',
        'Tree shade can reduce the need for air conditioning.',
        'A list of popular movies.',
        'A description of ocean currents.',
        'Instructions for drawing clouds.',
      ],
    ],
  },
  argument: {
    passage:
      'A student argues that school should start later because adolescents need sufficient sleep. She cites a district study reporting more sleep after start times changed, but does not discuss how bus schedules would change.',
    questions: [
      [
        'What is the student’s claim?',
        'School should start later.',
        'Buses should be removed.',
        'Students never sleep.',
        'Studies are unnecessary.',
      ],
      [
        'Which evidence directly supports her claim?',
        'A study reporting more sleep with later starts.',
        'The color of school buses.',
        'The number of classrooms.',
        'Her favorite breakfast.',
      ],
      [
        'Which issue remains unaddressed?',
        'The effect on bus schedules.',
        'Whether adolescents need sleep.',
        'Whether a study is cited.',
        'What change she recommends.',
      ],
    ],
  },
  grammar: {
    passage:
      'Consider the sentence: “After the rain stopped, the team practiced on the field.” A clause has a subject and a verb; a phrase does not contain both.',
    questions: [
      [
        'Which part is a dependent clause?',
        'After the rain stopped.',
        'On the field.',
        'The team.',
        'Practiced on.',
      ],
      [
        'Which part is a prepositional phrase?',
        'On the field.',
        'The rain stopped.',
        'The team practiced.',
        'After the rain stopped.',
      ],
      [
        'Which part can stand alone as a sentence?',
        'The team practiced on the field.',
        'After the rain stopped.',
        'On the field.',
        'After the rain.',
      ],
    ],
  },
  compare: {
    passage:
      'Text A is a poem with four stanzas and a repeated line about returning home. Text B is a short story that follows a traveler chronologically from departure to homecoming.',
    questions: [
      [
        'Which structural feature belongs to Text A?',
        'A repeated line in stanzas.',
        'A chronological chapter list.',
        'A table of contents.',
        'A dialogue-only script.',
      ],
      [
        'How does Text B organize its events?',
        'In time order.',
        'In rhyming couplets.',
        'By alphabet.',
        'As a list of definitions.',
      ],
      [
        'How can the repeated line in Text A shape meaning?',
        'It emphasizes the importance of home.',
        'It proves the poem is nonfiction.',
        'It eliminates the speaker.',
        'It gives a scientific explanation.',
      ],
    ],
  },
  writing: {
    passage:
      'Students are writing an argument about whether the school should add a garden. Their claim must state a clear, debatable position.',
    questions: [
      [
        'Which sentence is a clear claim?',
        'Our school should create a garden for science lessons.',
        'Do we have a garden?',
        'A garden contains plants.',
        'Gardens, plants, and soil.',
      ],
      [
        'Which revision makes “Gardens are good” more precise?',
        'A school garden would give students hands-on science practice.',
        'Gardens are really, really good.',
        'Good gardens are good things.',
        'There might be some gardens.',
      ],
      [
        'Which reason best supports a school garden?',
        'Students could observe plant life cycles directly.',
        'The cafeteria serves soup.',
        'The school has a mascot.',
        'Some pencils are green.',
      ],
    ],
  },
  theme: {
    passage:
      'Leah’s first clay bowl collapsed. Her second was uneven. She asked a classmate for advice, tried again, and finally made a bowl that could hold water.',
    questions: [
      [
        'Which theme is developed?',
        'Persistence and support can lead to improvement.',
        'Talent never changes.',
        'Asking for help prevents success.',
        'Mistakes should be hidden.',
      ],
      [
        'Which event develops that theme?',
        'Leah tries again after asking for advice.',
        'The bowl holds water.',
        'The classroom contains clay.',
        'A bowl has sides.',
      ],
      [
        'How does Leah change?',
        'She learns to seek advice and keep practicing.',
        'She decides never to make bowls.',
        'She becomes unwilling to learn.',
        'She avoids classmates.',
      ],
    ],
  },
  character: {
    passage:
      'Although Priya wanted the lead role, she helped Sam rehearse for the same audition. “A good show needs everyone,” she explained.',
    questions: [
      [
        'What motivates Priya’s help?',
        'She values the success of the whole show.',
        'She wants Sam to miss the audition.',
        'She dislikes performing.',
        'She was forced to help.',
      ],
      [
        'What conflict does Priya face?',
        'Personal ambition versus supporting a competitor.',
        'Choosing between two schools.',
        'Remembering a bus route.',
        'Finding a lost costume.',
      ],
      [
        'Which trait does her action reveal?',
        'Generosity.',
        'Dishonesty.',
        'Indifference.',
        'Impatience.',
      ],
    ],
  },
  figurative: {
    passage:
      '“The classroom was a beehive before the fair. Ideas buzzed from table to table, and the clock sprinted toward noon.”',
    questions: [
      [
        'What does the beehive metaphor suggest?',
        'The classroom is busy and active.',
        'There are insects in the desks.',
        'The classroom is silent.',
        'Students are making honey.',
      ],
      [
        'Which phrase uses personification?',
        'The clock sprinted toward noon.',
        'Before the fair.',
        'From table to table.',
        'The classroom.',
      ],
      [
        'What effect does “ideas buzzed” create?',
        'It conveys lively conversation.',
        'It explains electricity.',
        'It establishes total silence.',
        'It gives a literal sound measurement.',
      ],
    ],
  },
  summary: {
    passage:
      'A town turned an unused lot into a garden. Volunteers cleared litter in March and planted vegetables in April. By July, they were sharing produce with a nearby food pantry.',
    questions: [
      [
        'Which is the best objective summary?',
        'Volunteers converted a vacant lot into a garden that supplies a food pantry.',
        'The town finally did something wonderful.',
        'The vegetables were the tastiest ever.',
        'March comes before April.',
      ],
      [
        'Which detail is least necessary in a brief summary?',
        'The specific month when litter was cleared.',
        'The lot became a garden.',
        'Volunteers did the work.',
        'The garden supplies food.',
      ],
      [
        'Which sentence introduces an opinion?',
        'Every town should copy this brilliant project.',
        'Volunteers cleared litter.',
        'Vegetables were planted.',
        'Produce went to a pantry.',
      ],
    ],
  },
  perspective: {
    passage:
      'Ana describes a storm as an exciting chance to test her rain boots. Her brother describes the same storm as a reason his soccer game was canceled.',
    questions: [
      [
        'Why do their accounts differ?',
        'Their interests shape how they view the storm.',
        'They describe different years.',
        'One cannot see the rain.',
        'Both are describing snow.',
      ],
      [
        'How does Ana view the storm?',
        'As an opportunity.',
        'As a disaster.',
        'As a mystery.',
        'As a punishment.',
      ],
      [
        'What detail explains her brother’s reaction?',
        'The storm cancels his game.',
        'Ana owns boots.',
        'The rain is outdoors.',
        'Storms have clouds.',
      ],
    ],
  },
  structure: {
    passage:
      'An article first explains how plastic reaches rivers. Next it describes harm to wildlife. Finally it proposes filters on storm drains to reduce the problem.',
    questions: [
      [
        'Which structure best describes the whole article?',
        'Problem and solution.',
        'Alphabetical list.',
        'Biography.',
        'A fictional plot.',
      ],
      [
        'What is the role of the final section?',
        'It proposes a way to address the problem.',
        'It introduces a new character.',
        'It lists unrelated dates.',
        'It repeats only the title.',
      ],
      [
        'Which heading fits the middle section?',
        'Effects on river wildlife.',
        'The history of paper.',
        'How to draw fish.',
        'Famous ocean explorers.',
      ],
    ],
  },
  sources: {
    passage:
      'Source A says a bike lane reduced collisions by 20%, citing city records. Source B says the lane is unsafe, citing one neighbor’s experience.',
    questions: [
      [
        'What differs between the sources?',
        'The type and breadth of evidence.',
        'The language they are written in.',
        'The city being discussed.',
        'Whether they discuss transport.',
      ],
      [
        'Which source better supports a claim about overall collisions?',
        'Source A, because it uses citywide records.',
        'Source B, because one story is always enough.',
        'Neither, because numbers cannot be evidence.',
        'Both solely because they mention bikes.',
      ],
      [
        'What would help evaluate the disagreement?',
        'The dates and methods behind the collision records.',
        'The writers’ favorite colors.',
        'The neighbor’s shoe size.',
        'The length of each headline.',
      ],
    ],
  },
  connotation: {
    passage:
      'Two descriptions use similar meanings: “Nia is determined” and “Nia is stubborn.” Both suggest she rarely changes her mind.',
    questions: [
      [
        'Which word usually carries a more positive connotation?',
        'Determined.',
        'Stubborn.',
        'Both are always negative.',
        'Neither has a connotation.',
      ],
      [
        'Which word suggests wasteful spending?',
        'Extravagant.',
        'Generous.',
        'Helpful.',
        'Practical.',
      ],
      [
        'Why might a writer choose “slender” instead of “scrawny”?',
        'Slender usually sounds more approving.',
        'Slender means much heavier.',
        'Scrawny is a verb.',
        'They always have identical emotional effects.',
      ],
    ],
  },
  roots: {
    passage: 'The Greek root bio means life, geo means earth, and the suffix -logy means study of.',
    questions: [
      [
        'What does biology most likely mean?',
        'The study of living things.',
        'The study of stars.',
        'A measure of distance.',
        'A type of writing.',
      ],
      ['What does geology study?', 'Earth.', 'Language.', 'Sound.', 'Machines.'],
      [
        'If graph means write, what does biography describe?',
        'Writing about a person’s life.',
        'A map of rocks.',
        'A water measurement.',
        'A plant’s color.',
      ],
    ],
  },
  reference: {
    passage:
      'A dictionary entry reads: “minute /MIN-it/ noun: sixty seconds; minute /my-NOOT/ adjective: very small.”',
    questions: [
      [
        'Which meaning fits “a minute crack”?',
        'Very small.',
        'Sixty seconds.',
        'Extremely loud.',
        'Moving quickly.',
      ],
      [
        'Which resource best provides synonyms?',
        'A thesaurus.',
        'An atlas.',
        'A calendar.',
        'A multiplication chart.',
      ],
      [
        'What information distinguishes the two entries?',
        'Pronunciation and part of speech.',
        'Page color only.',
        'The number of letters.',
        'Alphabetical order alone.',
      ],
    ],
  },
  sentences: {
    passage: 'A writer wants to combine: “The sun set. The hikers lit a lantern.”',
    questions: [
      [
        'Which version forms a compound sentence?',
        'The sun set, and the hikers lit a lantern.',
        'After the sun set.',
        'The setting sun.',
        'Hikers lighting a lantern.',
      ],
      [
        'Which version is a complex sentence?',
        'When the sun set, the hikers lit a lantern.',
        'The sun set.',
        'The hikers lit a lantern.',
        'The sun and the lantern glowed.',
      ],
      [
        'What is one reason to vary sentence structures?',
        'To clarify relationships and create rhythm.',
        'To remove all punctuation.',
        'To ensure every sentence is a fragment.',
        'To make every sentence equally long.',
      ],
    ],
  },
  modifiers: {
    passage:
      'An editor is correcting sentences so that descriptions clearly attach to the intended person or object.',
    questions: [
      [
        'Which sentence places the modifier clearly?',
        'Wearing a red hat, Luis entered the room.',
        'Wearing a red hat, the room welcomed Luis.',
        'Luis entered the red room wearing a hat room.',
        'The room, wearing Luis, had a red hat.',
      ],
      [
        'What is wrong with “Running to class, my book fell”?',
        'It suggests the book was running.',
        'It lacks a verb.',
        'It has no noun.',
        'It is a question.',
      ],
      [
        'Which correction is clearest?',
        'As I ran to class, my book fell.',
        'Running, class fell my book.',
        'My running book fell to class.',
        'To class, the book ran and fell.',
      ],
    ],
  },
  pronouns: {
    passage: 'Choose pronouns that agree with their antecedents and fit their grammatical role.',
    questions: [
      ['Complete: “Maya and ___ presented the project.”', 'I.', 'Me.', 'My.', 'Mine.'],
      ['Complete: “The teacher gave the notes to Leo and ___.”', 'Me.', 'I.', 'My.', 'Myselfs.'],
      [
        'Which sentence has a clear pronoun reference?',
        'Ava handed her own notebook to Noor.',
        'When Ava met Noor, she was late.',
        'They said it was there.',
        'It gave them that.',
      ],
    ],
  },
  spelling: {
    passage: 'A student is proofreading a report before submitting it.',
    questions: [
      ['Which word is spelled correctly?', 'Necessary.', 'Neccessary.', 'Necesary.', 'Necessery.'],
      [
        'Which word correctly completes “Please ___ the package”?',
        'Receive.',
        'Recieve.',
        'Receeve.',
        'Receve.',
      ],
      ['Which plural is correct?', 'Libraries.', 'Librarys.', 'Libraris.', 'Librariez.'],
    ],
  },
  commas: {
    passage:
      'Nonrestrictive information adds detail that can be removed without changing the basic identity of the noun.',
    questions: [
      [
        'Which sentence punctuates the extra detail correctly?',
        'My bike, a gift from my aunt, is blue.',
        'My bike a gift, from my aunt is blue.',
        'My, bike a gift from my aunt is blue.',
        'My bike a gift from my aunt, is, blue.',
      ],
      [
        'Which part is nonrestrictive in “Mr. Li, our principal, spoke”?',
        'Our principal.',
        'Mr. Li.',
        'Spoke.',
        'The whole sentence.',
      ],
      [
        'Why are two commas used around “our principal”?',
        'They mark the beginning and end of extra information.',
        'Every sentence needs two commas.',
        'The phrase is a question.',
        'They replace the verb.',
      ],
    ],
  },
  capitalization: {
    passage: 'A student writes about a trip to Washington in November with her English class.',
    questions: [
      ['Which word must be capitalized?', 'November.', 'Trip.', 'Class.', 'With.'],
      [
        'Which title uses capitals correctly?',
        'President Lincoln.',
        'president lincoln.',
        'President lincoln.',
        'president Lincoln when used as a title.',
      ],
      [
        'Which sentence is correct?',
        'We studied Spanish on Tuesday.',
        'We studied spanish on Tuesday.',
        'We studied Spanish on tuesday.',
        'we studied Spanish on Tuesday.',
      ],
    ],
  },
  organization: {
    passage:
      'A writer argues that a school garden would support science lessons, improve lunches, and build teamwork.',
    questions: [
      [
        'Which organization best supports the argument?',
        'Group evidence under each of the three reasons.',
        'Mix unrelated facts at random.',
        'List only personal memories.',
        'Repeat the claim without evidence.',
      ],
      [
        'Where should evidence about plant experiments go?',
        'In the science-learning section.',
        'In an unrelated introduction about sports.',
        'Only in the title.',
        'Nowhere in the argument.',
      ],
      [
        'What should the conclusion do?',
        'Draw together the reasons supporting the claim.',
        'Introduce an unrelated claim.',
        'Contradict all the evidence.',
        'Remove the writer’s position.',
      ],
    ],
  },
  transitions: {
    passage: 'A writer links reasons and evidence in an argument about a school garden.',
    questions: [
      [
        'Which transition introduces an additional reason?',
        'Furthermore.',
        'In contrast.',
        'Despite this.',
        'On the contrary.',
      ],
      [
        'Which transition introduces a contrasting view?',
        'However.',
        'Similarly.',
        'In addition.',
        'For example.',
      ],
      [
        'Complete: “Plants need water. ___, we should collect rainwater.”',
        'Therefore.',
        'Nevertheless.',
        'In contrast.',
        'Meanwhile, unrelatedly.',
      ],
    ],
  },
  narrative: {
    passage:
      'A story opens: “At dawn, Malik waited on the dock, gripping a letter. The last boat home was already leaving.”',
    questions: [
      [
        'Which detail establishes the setting?',
        'At dawn, on the dock.',
        'Malik’s favorite meal.',
        'The letter’s handwriting.',
        'The narrator’s age.',
      ],
      [
        'What conflict is introduced?',
        'Malik may miss his chance to get home.',
        'Malik has too many boats.',
        'The dock needs paint.',
        'The letter is too long.',
      ],
      [
        'Which next event follows logically?',
        'Malik calls to the captain and runs along the dock.',
        'A recipe lists three cups of flour.',
        'The narrator explains unrelated math facts.',
        'A dictionary defines every noun.',
      ],
    ],
  },
};
export const echoItems: Record<string, EchoItem[]> = Object.fromEntries(
  Object.entries(content).map(([skill, { passage, questions }]) => [
    skill,
    questions.map(([question, ...choices], i) => {
      const offset = skill === 'evidence' ? 0 : i;
      const options = [
        ...choices.slice(offset),
        ...choices.slice(0, offset),
      ] as EchoItem['options'];
      return { id: `${skill}-${i + 1}`, passage, question, options, answer: (4 - offset) % 4 };
    }),
  ]),
);
