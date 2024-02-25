import chalk from 'chalk';
import core from '@actions/core';
import exec from '@actions/exec';

async function run() {
  try {
    // install binary params
    const install_params = [ "install", "--locked", "cargo-verison" ];
    const force_install = core.getBooleanInput('force-install');
    if (force_install) {
      install_params.push("--force");
    }

    // run install cmd with params
    await exec.getExecOutput("cargo", install_params);
    const version_output = await exec.getExecOutput("cargo-verison", [ "current" ]);
    const prev_version = (await version_output).stdout.trim();
    core.setOutput("prev_version", prev_version);

    // version
    const version = core.getInput('version');
    console.log(chalk.blue(`Version: ${version}`));

    // message
    const message = core.getInput('message');
    console.log(chalk.blue(`Message: ${message}`));

    // git-tag-version
    const git_tag_version = core.getBooleanInput('git-tag-version');
    console.log(chalk.blue(`Git tag version: ${git_tag_version}`));

    let params = [ version, "-m", message ];
    if (!git_tag_version) {
      params.push('--git-tag-version=false');
    }

    // run main command
    await exec.getExecOutput('cargo-verison', params)

    const new_version_output = await exec.getExecOutput("cargo-verison", [ "current" ]);
    const new_version = new_version_output.stdout.trim();
    core.setOutput("next_version", new_version);

    console.log(chalk.green(`Previous version: ${prev_version}`));
    console.log(chalk.green(`Next version: ${new_version}`));
  } catch (error) {
    core.setFailed(error.message);
  }  
}

run();
