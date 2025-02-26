import prompts from 'prompts';

import { timeout } from 'helpers/asyncHelper';
import { addSpacesForEnum, capitalizeFirstLetter } from 'helpers/stringHelper';

export const mainMenu = async (
  menuLookup: { [key: string]: () => Promise<void> },
  onCancel: () => void,
) => {
  const menuChoice = await prompts({
    type: 'select',
    name: 'value',
    message: 'What would you like to do?',
    choices: Object.keys(menuLookup).map((menuItem) => ({
      title: capitalizeFirstLetter(addSpacesForEnum(menuItem)).replace(' Exit', ''),
      value: menuItem,
    })),
  });

  if (menuChoice == null || menuChoice.value == null) {
    onCancel();
    return;
  }

  const startTime = performance.now();
  await menuLookup[menuChoice.value]();
  const endTime = performance.now();

  if (menuChoice.value.toLowerCase().includes('exit') == false) {
    console.log(`\tCompleted  in ${Math.round(endTime - startTime)} milliseconds\r\n`);
  }
  await timeout(500);
};

export const languagePrompt = async (
  availableLanguages: Array<string>,
): Promise<string | undefined> => {
  const langChoice = await prompts({
    type: 'select',
    name: 'value',
    message: 'Which language?',
    choices: availableLanguages.map((lang) => ({
      title: capitalizeFirstLetter(lang),
      value: lang,
    })),
  });
  if (availableLanguages.includes(langChoice.value) == false) {
    console.error('Invalid language selected');
    return;
  }

  return langChoice.value;
};

export const yesOrNoPrompt = async (questionText: string): Promise<boolean> => {
  const yesNoChoice = await prompts({
    type: 'select',
    name: 'value',
    message: questionText,
    choices: [
      { title: 'No', value: false },
      { title: 'Yes', value: true },
    ],
  });

  return !!yesNoChoice.value;
};
