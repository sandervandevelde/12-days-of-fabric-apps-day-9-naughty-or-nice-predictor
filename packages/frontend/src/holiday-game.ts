export type List = 'naughty' | 'nice';
export const symbols = ['tree', 'gift', 'bell', 'cane', 'coal', 'snow'] as const;
export type ReelSymbol = (typeof symbols)[number];

export const questions = {
  naughty: [
    'Ever peeked at a present before Christmas?',
    'Have you ever eaten the cookies meant for Santa?',
    'Ever blamed an elf for your mess?',
    'Have you shaken a gift to guess what was inside?',
    'Ever claimed the last gingerbread cookie was yours?',
    'Have you ever regifted a holiday present?',
    'Ever started a snowball fight from behind a tree?',
    'Have you hidden the good chocolate for yourself?',
    'Ever opened the wrong door on an advent calendar?',
    'Have you eaten tomorrow’s advent chocolate today?',
    'Ever passed off store-bought cookies as homemade?',
    'Have you left a mysterious empty box under the tree?',
    'Ever worn pajamas all day at a holiday gathering?',
    'Have you skipped to the best part of a Christmas movie?',
    'Ever danced to Christmas music before November?',
    'Have you snuck whipped cream straight from the can?',
    'Ever put silly googly eyes on a decoration?',
    'Have you secretly moved an ornament you didn’t like?',
    'Ever wrapped a tiny gift in a comically huge box?',
    'Have you put jingle bells somewhere surprising?',
    'Ever picked all the marshmallows out of the cocoa mix?',
    'Have you worn tinsel as a scarf?',
    'Ever claimed an extra slice of pie was for later?',
    'Have you hidden a singing decoration to keep it quiet?',
    'Ever put a bow on someone’s back without telling them?',
    'Have you worn mismatched festive socks on purpose?',
    'Ever built a snowman with a ridiculous expression?',
    'Have you made a holiday pun just to hear everyone groan?',
    'Ever tried to guess your stocking contents by touch?',
    'Have you eaten icing before the cookies cooled?',
    'Ever helped yourself to the decorative candy canes?',
    'Have you pretended not to know who broke the gingerbread roof?',
    'Ever wrapped a present with last year’s gift tag still on it?',
    'Have you fought for the best couch spot on movie night?',
    'Ever worn a Santa hat somewhere totally unexpected?',
    'Have you secretly changed the holiday playlist?',
    'Ever made yourself an extra-fancy cocoa and told nobody?',
    'Have you used a gift bag because wrapping defeated you?',
    'Ever sampled the holiday buffet before it officially opened?',
    'Have you sung the wrong lyrics confidently at a singalong?',
    'Ever declared yourself the winner of a cookie contest?',
    'Have you tried to pass off a lumpy snowball as a snow sculpture?',
    'Ever made a blanket fort and refused to come out for chores?',
    'Have you put so much frosting on a cookie it became a cupcake?',
    'Ever worn a festive sweater inside out and called it fashion?',
    'Have you put a joke gift at the very top of your wish list?',
    'Ever wrapped a present in a maze of ribbon?',
    'Have you grabbed the crispy corner of the holiday bake first?',
    'Ever made a snow angel where someone just shoveled?',
    'Have you snuck one more bite after saying you were full?',
  ],
  nice: [
    'Would you share your last Christmas cookie?',
    'Have you helped someone untangle Christmas lights?',
    'Would you make a spare mug of cocoa for a friend?',
    'Have you made a card just to cheer someone up?',
    'Would you give away the cozy seat by the fire?',
    'Have you thanked someone for a handmade gift?',
    'Would you help a neighbor clear a snowy path?',
    'Have you saved the best cookie for someone else?',
    'Would you let someone pick the holiday movie?',
    'Have you helped wrap a tricky-shaped gift?',
    'Would you share your extra mittens on a cold day?',
    'Have you invited someone to join a festive game?',
    'Would you bring a treat to someone working over the holidays?',
    'Have you complimented someone’s wonderfully silly sweater?',
    'Would you help the smallest decorator reach the tree?',
    'Have you made a playlist for someone who needed cheering up?',
    'Would you write a thank-you note to a helpful elf?',
    'Have you offered to do the dishes after a big meal?',
    'Would you hold the door for someone carrying gifts?',
    'Have you helped rebuild a fallen gingerbread house?',
    'Would you leave a kind note inside a library book?',
    'Have you called someone who was spending the holidays alone?',
    'Would you give up your turn to let a new player try?',
    'Have you delivered a homemade treat to a neighbor?',
    'Would you save the softest blanket for a guest?',
    'Have you taught someone your favorite holiday recipe?',
    'Would you help find a missing ornament?',
    'Have you mailed a card to someone far away?',
    'Would you cheer for the snowman that came in last?',
    'Have you made space at the table for an unexpected guest?',
    'Would you help pack away decorations?',
    'Have you picked up wrapping paper after a gift exchange?',
    'Would you let someone else place the star on the tree?',
    'Have you offered to take a group photo so everyone could be in it?',
    'Would you make a paper snowflake for someone’s window?',
    'Have you helped decorate somewhere that needed cheering up?',
    'Would you bring extra marshmallows to share?',
    'Have you repaired an old decoration that mattered to someone?',
    'Would you slow down on a winter walk for a friend?',
    'Have you shared a favorite holiday story?',
    'Would you lend your warmest scarf?',
    'Have you made someone laugh on a gloomy winter day?',
    'Would you remember to include a shy guest in the conversation?',
    'Have you helped a friend pick a thoughtful gift?',
    'Would you volunteer to carry the heaviest bag?',
    'Have you sent a kind message for no special reason?',
    'Would you swap snacks so everyone gets a favorite?',
    'Have you helped an overwhelmed host take a break?',
    'Would you clap for someone’s first attempt at caroling?',
    'Have you checked in on someone after the festivities ended?',
  ],
} satisfies Record<List, string[]>;

export function drawQuestions(previous?: Record<List, number>): Record<List, number> {
  function draw(list: List) {
    const last = previous?.[list];
    const index = Math.floor(Math.random() * (questions[list].length - Number(last !== undefined)));
    return last !== undefined && index >= last ? index + 1 : index;
  }
  return { naughty: draw('naughty'), nice: draw('nice') };
}

export function getOdds(selection: List | null): Record<List, number> {
  const nice = selection === 'nice' ? 55 : selection === 'naughty' ? 45 : 50;
  return { naughty: 100 - nice, nice };
}

export function predict(selection: List | null, roll = Math.random()): List {
  return roll < getOdds(selection).nice / 100 ? 'nice' : 'naughty';
}
