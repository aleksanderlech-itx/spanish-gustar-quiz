"""Generate content/idioms.xlsx: 100 Spanish idiom flashcards for issue #51.

One-off content-prep script (not part of the app runtime). Run with:
    python scripts/generate_idioms_xlsx.py
"""

from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

IDIOMS = [
    ("Costar un ojo de la cara", "To cost an eye from the face", "Used when something is extremely expensive", "To cost an arm and a leg"),
    ("Estar en las nubes", "To be in the clouds", "Describes someone distracted or daydreaming", "To have one's head in the clouds"),
    ("Tomar el pelo", "To take the hair", "To tease or joke with someone, often to fool them", "To pull someone's leg"),
    ("No tener pelos en la lengua", "To not have hairs on the tongue", "Describes someone who speaks very bluntly and honestly", "To not mince words"),
    ("Ser pan comido", "To be eaten bread", "Something extremely easy to do", "To be a piece of cake"),
    ("Meter la pata", "To stick in the paw/hoof", "To make a blunder or say/do the wrong thing", "To put one's foot in it"),
    ("Estar como una cabra", "To be like a goat", "Describes someone who acts crazy or eccentric", "To be as mad as a hatter"),
    ("Dar en el clavo", "To hit the nail", "To guess or state something exactly right", "To hit the nail on the head"),
    ("Ponerse las pilas", "To put in the batteries", "To get focused, energized and start working seriously", "To get one's act together"),
    ("Ser uña y carne", "To be nail and flesh", "Describes two people who are inseparable friends", "To be thick as thieves"),
    ("Írsele la mano a alguien", "Someone's hand slips away", "To overdo or go too far with something", "To overdo it"),
    ("Estar hasta las narices", "To be up to the nostrils", "To be completely fed up with something", "To be fed up to the back teeth"),
    ("Tirar la casa por la ventana", "To throw the house out the window", "To spend money lavishly, holding nothing back", "To go all out / push the boat out"),
    ("Hablar por los codos", "To talk through the elbows", "Describes someone who talks excessively", "To talk a mile a minute"),
    ("Buscarle tres pies al gato", "To look for three feet on the cat", "To overanalyze or complicate something simple", "To split hairs"),
    ("Ser la gota que colma el vaso", "To be the drop that fills the glass", "The final small thing that makes a bad situation unbearable", "To be the last straw"),
    ("Dormir a pierna suelta", "To sleep with a loose leg", "To sleep very deeply and soundly", "To sleep like a log"),
    ("Estar en la luna", "To be on the moon", "To be distracted or absent-minded", "To be out of it / spaced out"),
    ("Ponerse rojo como un tomate", "To turn as red as a tomato", "To blush from embarrassment", "To turn beet red"),
    ("Cortar el bacalao", "To cut the codfish", "To be the person in charge who makes the decisions", "To call the shots"),
    ("Echar leña al fuego", "To throw wood on the fire", "To make a bad or tense situation worse", "To add fuel to the fire"),
    ("Ahogarse en un vaso de agua", "To drown in a glass of water", "To get overwhelmed by a very small problem", "To make a mountain out of a molehill"),
    ("Estar como pez en el agua", "To be like a fish in water", "To feel completely comfortable in a situation", "To be in one's element"),
    ("Ser el ojo derecho de alguien", "To be someone's right eye", "To be someone's clear favorite", "To be the apple of someone's eye"),
    ("Poner el grito en el cielo", "To put the scream in the sky", "To complain loudly and dramatically", "To hit the roof"),
    ("Irse por las ramas", "To go off along the branches", "To avoid the main point of a conversation", "To beat around the bush"),
    ("Sacar las castañas del fuego", "To take the chestnuts out of the fire", "To get someone out of a difficult situation, often at one's own risk", "To pull someone's chestnuts out of the fire"),
    ("Matar dos pájaros de un tiro", "To kill two birds with one shot", "To achieve two goals with a single action", "To kill two birds with one stone"),
    ("Ser pez gordo", "To be a fat fish", "To be an important or powerful person", "To be a big shot / big fish"),
    ("Tener mala leche", "To have bad milk", "To have bad intentions or be in a bad mood", "To be in a foul mood"),
    ("Estar sin blanca", "To be without a \"blanca\" (an old coin)", "To have no money at all", "To be flat broke"),
    ("Ponerse las botas", "To put on the boots", "To indulge greatly, especially by eating a lot or profiting", "To pig out / make a killing"),
    ("Írsele el santo al cielo", "Someone's saint goes up to heaven", "To suddenly forget what one was going to say or do", "To go blank"),
    ("Quedarse de piedra", "To be left like stone", "To be utterly shocked or stunned", "To be dumbfounded"),
    ("No dar pie con bola", "To not connect foot with ball", "To fail repeatedly at getting anything right", "To not get anything right"),
    ("Coser y cantar", "Sewing and singing", "Describes a task that is very simple to accomplish", "A piece of cake / a walk in the park"),
    ("Estar en el ajo", "To be in the garlic", "To be involved in a (often secret) matter", "To be in the loop"),
    ("Ser harina de otro costal", "To be flour from another sack", "To be a completely unrelated, different matter", "To be a horse of a different color"),
    ("Írsele la lengua", "Someone's tongue slips", "To accidentally say something one shouldn't have", "To let something slip"),
    ("Estar entre la espada y la pared", "To be between the sword and the wall", "To face a difficult choice with no good options", "To be between a rock and a hard place"),
    ("Tener la sartén por el mango", "To hold the frying pan by the handle", "To be the one in control of a situation", "To have the upper hand"),
    ("Poner toda la carne en el asador", "To put all the meat on the grill", "To commit every resource to achieve something", "To go all in / all out"),
    ("Irse al garete", "To drift off course (nautical)", "For a plan or situation to fail completely", "To go down the drain"),
    ("Ser un aguafiestas", "To be a party-spoiling water", "To be someone who ruins other people's fun", "To be a party pooper"),
    ("Estar hecho polvo", "To be turned into dust", "To be extremely tired or worn out", "To be beat / wiped out"),
    ("Costar Dios y ayuda", "To cost God and help", "To be extremely difficult to accomplish", "To be like pulling teeth"),
    ("Írsele el hilo", "Someone loses the thread", "To lose track of what one was saying or thinking", "To lose one's train of thought"),
    ("Tomar cartas en el asunto", "To take cards in the matter", "To personally step in and take action on an issue", "To take matters into one's own hands"),
    ("Salirse con la suya", "To come out with one's own", "To get exactly what one wanted, often stubbornly", "To have it one's own way"),
    ("Estar como una regadera", "To be like a watering can", "To behave in a wildly crazy way", "To be nuts / stark raving mad"),
    ("No tener ni pies ni cabeza", "To have neither feet nor head", "Describes something that makes absolutely no sense", "To make no sense at all"),
    ("Ser el pan nuestro de cada día", "To be our daily bread", "To be something that happens routinely, day after day", "To be an everyday occurrence"),
    ("Dar la lata", "To give the tin can", "To bother or pester someone persistently", "To be a pain / nag"),
    ("Tener enchufe", "To have a plug", "To have personal connections that grant favors or advantages", "To have connections / pull strings"),
    ("Írsele la olla", "Someone's pot slips away", "To temporarily lose one's mind or self-control", "To lose it"),
    ("Estar de mala uva", "To be of bad grape", "To be in a bad mood", "To be in a bad mood"),
    ("Ser un cero a la izquierda", "To be a zero to the left", "To count for nothing, have no influence at all", "To count for nothing"),
    ("Tirar la toalla", "To throw the towel", "To give up on something", "To throw in the towel"),
    ("Poner los puntos sobre las íes", "To put the dots over the i's", "To clarify a matter precisely, leaving no ambiguity", "To dot the i's and cross the t's"),
    ("Ser un cuento chino", "To be a Chinese tale", "To be an implausible story or excuse", "To be a tall tale / fish story"),
    ("Irse por los cerros de Úbeda", "To wander off to the hills of Úbeda", "To go off on an irrelevant tangent", "To go off on a tangent"),
    ("Poner una pica en Flandes", "To plant a pike in Flanders", "To achieve something extraordinarily difficult (from historic Spanish military campaigns)", "To pull off quite a feat"),
    ("Comerse el coco", "To eat one's coconut (head)", "To think obsessively or worry too much about something", "To rack one's brain"),
    ("Ser agua pasada", "To be water gone by", "To be a past matter that no longer has any importance", "To be water under the bridge"),
    ("Estar en su salsa", "To be in one's own sauce", "To be completely comfortable doing what one enjoys", "To be in one's element"),
    ("Írsele la fuerza por la boca", "One's strength escapes through the mouth", "To boast a lot without backing it up with actions", "To be all talk (and no action)"),
    ("Dar gato por liebre", "To give cat instead of hare", "To deceive someone by passing off something inferior as good", "To pull a fast one / rip someone off"),
    ("Ser más raro que un perro verde", "To be stranger than a green dog", "To be extremely unusual or odd", "To be as odd as they come"),
    ("Tener un humor de perros", "To have the mood of dogs", "To be in an extremely bad temper", "To be like a bear with a sore head"),
    ("Irse todo al traste", "For everything to go to the junk pile", "For plans or a project to fail completely", "To go down the drain"),
    ("Ser la niña de sus ojos", "To be the girl of one's eyes", "To be someone's most cherished, favorite person", "To be the apple of someone's eye"),
    ("Estar al loro", "To be at the parrot", "To be alert and up to date with what's happening", "To be on the ball"),
    ("No ver tres en un burro", "To not see three on a donkey", "To have very poor eyesight", "To be as blind as a bat"),
    ("Llevarse el gato al agua", "To take the cat to the water", "To succeed in getting one's way despite difficulty", "To pull it off"),
    ("Tener mano izquierda", "To have a left hand", "To handle delicate situations with tact and skill", "To have a diplomatic touch"),
    ("Írsele a alguien de las manos", "To slip out of someone's hands", "To lose control over a situation", "To get out of hand"),
    ("Ser el hazmerreír", "To be the \"make-me-laugh\"", "To become an object of public ridicule", "To be a laughingstock"),
    ("Dorar la píldora", "To gild the pill", "To soften bad news by presenting it more pleasantly", "To sugarcoat something"),
    ("Irse a pique", "To sink to a peak (nautical: to sink)", "For something, like a plan or business, to collapse or fail", "To go under"),
    ("Estar como unas castañuelas", "To be like castanets", "To be extremely happy and lively", "To be over the moon"),
    ("Meter la nariz en todo", "To stick one's nose into everything", "To be nosy and meddle in others' affairs", "To stick one's nose into everything"),
    ("Ser el colmo", "To be the height/limit", "To be the outrageous last straw in a situation", "To be the last straw / the limit"),
    ("Irse por los pelos", "To leave by the hairs", "To narrowly escape or avoid something bad", "To escape by the skin of one's teeth"),
    ("No tener dos dedos de frente", "To not have two fingers of forehead", "To lack common sense or intelligence", "To not have the sense one was born with"),
    ("Ser un lince", "To be a lynx", "To be very perceptive and sharp-witted", "To be sharp as a tack"),
    ("Estar a dos velas", "To be down to two candles", "To have no money left at all", "To be flat broke"),
    ("Írsele el genio", "One's temper slips away", "To lose one's temper suddenly", "To lose one's temper"),
    ("Ponerle el cascabel al gato", "To put the bell on the cat", "To be the one brave enough to take on a risky task", "To bell the cat"),
    ("Ser más viejo que Matusalén", "To be older than Methuselah", "To be extremely old (biblical reference)", "To be as old as the hills"),
    ("Tener la mosca detrás de la oreja", "To have the fly behind the ear", "To be suspicious that something isn't right", "To smell a rat"),
    ("Írsele la cabeza", "One's head slips away", "To become confused, forgetful, or lose focus", "To lose one's head"),
    ("Ser carne de cañón", "To be cannon meat", "To be in an expendable, high-risk position", "To be cannon fodder"),
    ("Irse de rositas", "To leave with little roses", "To escape blame or punishment easily", "To get off scot-free"),
    ("Estar como agua para chocolate", "To be like water for hot chocolate", "To be at the boiling point with anger or passion", "To be fuming / at boiling point"),
    ("Ponerse hecho una fiera", "To turn into a wild beast", "To become extremely angry", "To become furious"),
    ("Hacer de tripas corazón", "To make a heart out of guts", "To find courage and face something despite fear", "To pluck up courage"),
    ("Ser más terco que una mula", "To be more stubborn than a mule", "To be extremely stubborn", "To be stubborn as a mule"),
    ("Estar entre algodones", "To be kept among cotton", "To be overprotected and shielded from hardship", "To be wrapped in cotton wool"),
    ("No pegar ojo", "To not stick an eye", "To not sleep at all, even for a moment", "To not sleep a wink"),
    ("Ser de armas tomar", "To be of arms to take", "To be a formidable person not to be underestimated or crossed", "To not be someone to be trifled with"),
]

assert len(IDIOMS) == 100, f"expected 100 idioms, got {len(IDIOMS)}"

FONT_NAME = "Arial"
HEADER_FILL = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
HEADER_FONT = Font(name=FONT_NAME, bold=True, color="FFFFFF", size=11)
BODY_FONT = Font(name=FONT_NAME, size=11)
NUMBER_FONT = Font(name=FONT_NAME, size=11, color="808080")
WRAP = Alignment(vertical="top", wrap_text=True)
CENTER = Alignment(vertical="top", horizontal="center")

wb = Workbook()
ws = wb.active
ws.title = "Idioms"

headers = ["#", "Spanish Idiom", "Literal Translation", "Meaning / Explanation", "English Equivalent"]
ws.append(headers)
for col in range(1, len(headers) + 1):
    cell = ws.cell(row=1, column=col)
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.alignment = CENTER
ws.freeze_panes = "A2"

for i, (idiom, literal, meaning, equivalent) in enumerate(IDIOMS, start=1):
    row = [i, idiom, literal, meaning, equivalent]
    ws.append(row)
    r = i + 1
    ws.cell(row=r, column=1).font = NUMBER_FONT
    ws.cell(row=r, column=1).alignment = CENTER
    for col in (2, 3, 4, 5):
        cell = ws.cell(row=r, column=col)
        cell.font = BODY_FONT
        cell.alignment = WRAP

widths = {1: 5, 2: 32, 3: 34, 4: 46, 5: 34}
for col, width in widths.items():
    ws.column_dimensions[get_column_letter(col)].width = width

for r in range(2, len(IDIOMS) + 2):
    ws.row_dimensions[r].height = 30

wb.save("content/idioms.xlsx")
print("Wrote content/idioms.xlsx with", len(IDIOMS), "idioms")
