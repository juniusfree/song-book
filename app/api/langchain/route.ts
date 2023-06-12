import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { NextResponse } from "next/server";
import { rootURL } from "@/app/utils";

const createOpenAIModel = async (key: string) => {
  const { data: openAIApiKey } = await fetch(
    `${rootURL}/api/openAIAuthDecrypt`,
    {
      method: "POST",
      body: JSON.stringify({ encryptedData: key }),
    }
  ).then((res) => res.json());
  const model = new OpenAI({
    openAIApiKey,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    verbose: true,
  });
  return model;
};

const identifyThemesPromptRawTemplate = `
    You will be given the details of a book.
    Generate the top 10 concepts, in comma-separated list, that closely matches the book's plot, theme and tone.
    The closest match will be the one with the closest semantic meaning. Not just string similarity.

    book's title: {title}, description: {description} and subjects: {subjects}.

    `;

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  genres:
    "this is a comma-separated list of genres based on the list of genres. no spaces between commas and genres.",
});

const formatInstructions = parser.getFormatInstructions();

const themesPromptTemplate = new PromptTemplate({
  template: identifyThemesPromptRawTemplate,
  inputVariables: ["title", "description", "subjects"],
});

const createThemesPromptTemplate = async ({
  title,
  description,
  subjects,
}: {
  title: string;
  description: string | { value: string };
  subjects: string[];
}) => {
  const descriptionValue =
    typeof description === "string" ? description : description.value;
  const prompt = await themesPromptTemplate
    .format({
      title,
      description: descriptionValue,
      subjects,
    })
    .then((res) => res);
  return prompt;
};

const identifyGenrePromptRawTemplate = `

You will be given a list of book themes.
Select the top 3 closest song genres that match the book themes.
The closest match will be the one with the closest semantic meaning. Not just string similarity.


Format instructions: {format_instructions}

book themes: {themes}
You will only select from the following song genres: {genres}{genres}{genres}

YOUR ANSWER:

`;

const identifyGenrePromptTemplate = new PromptTemplate({
  template: identifyGenrePromptRawTemplate,
  inputVariables: ["genres", "themes"],
  partialVariables: { format_instructions: formatInstructions },
});

const extractJson = (text: string) => {
  if (!text.includes("```json")) return text;
  return text.split("```json")[1].trim().split("```")[0].trim();
};

export async function POST(req: Request) {
  try {
    const { worksKey, openAIAccessToken, spotifyAccessToken } =
      await req.json();

    const { data: works } = await fetch(`${rootURL}/api/openLibraryWorks`, {
      method: "POST",
      body: JSON.stringify({ key: `works/${worksKey}` }),
    }).then((res) => res.json());
    const { title, description, subjects } = works;

    const model = await createOpenAIModel(openAIAccessToken).then((res) => res);
    const themePrompt = await createThemesPromptTemplate({
      title,
      description,
      subjects,
    }).then((res) => res);
    const bookThemes = await model.call(themePrompt).then((res) => res);

    const spotifyAuthorization = `Bearer ${spotifyAccessToken}`;
    const spotifyGenreSeeds = await fetch(
      `${rootURL}/api/spotifyGetAvailableGenreSeeds`,
      {
        headers: { authorization: spotifyAuthorization },
      }
    ).then((res) => res.json());
    const genrePrompt = await identifyGenrePromptTemplate
      .format({
        genres: spotifyGenreSeeds.data.genres,
        themes: bookThemes,
      })
      .then((res) => res);
    const songGenres = await model.call(genrePrompt).then((res) => res);

    const spotifyRecommendations = await fetch(
      `${rootURL}/api/spotifyGetRecommendations`,
      {
        method: "POST",
        body: JSON.stringify({
          genres: JSON.parse(extractJson(songGenres))?.genres,
        }),
        headers: { authorization: spotifyAuthorization },
      }
    ).then((res) => res.json());
    return NextResponse.json(spotifyRecommendations);
  } catch (err) {
    return NextResponse.json({ err });
  }
}
