import chalk from 'chalk';
import { getBooleanInput, getInput, setOutput, setFailed } from '@actions/core';
import { getExecOutput } from '@actions/exec';

async function install_binary() {
  // install binary params
  const install_params = [ "install", "--locked", "cargo-verison" ];
  const force_install = getBooleanInput('force-install');
  if (force_install) {
    install_params.push("--force");
  }

  // run install cmd with params
  await getExecOutput("cargo", install_params);
}

async function bump_version(workspace) {
  const version_output = await getExecOutput("cargo-verison", [
      "current",
      `--workspace=${workspace}`
  ]);

  const prev_version = (await version_output).stdout.trim();
  setOutput("prev_version", prev_version);

  // version
  const version = getInput('version');
  console.log(chalk.blue(`Version: ${version}`));

  // message
  const message = getInput('message');
  console.log(chalk.blue(`Message: ${message}`));

  // git-tag-version
  const git_tag_version = getBooleanInput('git-tag-version');
  console.log(chalk.blue(`Git tag version: ${git_tag_version}`));

  let params = [ version, "-m", message ];
  if (!git_tag_version) {
    params.push('--git-tag-version=false');
  }

  params.push(`--workspace=${workspace}`);

  // run main command
  await getExecOutput('cargo-verison', params)

  const new_version_output = await getExecOutput("cargo-verison", [
      "current",
      `--workspace=${workspace}`
  ]);
  const new_version = new_version_output.stdout.trim();
  setOutput("next_version", new_version);

  console.log(chalk.green(`Previous version: ${prev_version}`));
  console.log(chalk.green(`Next version: ${new_version}`));
}

async function run() {
  try {
    const skip_install = getBooleanInput('skip-install');
    if (!skip_install) {
      await install_binary();
    }

    // is it a standalone project or a workspace project
    const workspace = getBooleanInput("workspace");

    const skip_bump = getBooleanInput('skip-bump')
    if (!skip_bump) {
      await bump_version(workspace);
    }
  } catch (error) {
    setFailed(error.message);
  }  
}

run();
