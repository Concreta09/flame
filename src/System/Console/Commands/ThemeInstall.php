<?php

namespace Igniter\System\Console\Commands;

use Igniter\Main\Classes\ThemeManager;
use Igniter\System\Classes\UpdateManager;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;

class ThemeInstall extends Command
{
    /**
     * The console command name.
     */
    protected $name = 'theme:install';

    /**
     * The console command description.
     */
    protected $description = 'Install an theme from the TastyIgniter marketplace.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $themeName = $this->argument('name');
        $manager = UpdateManager::instance();

        $response = $manager->requestApplyItems([[
            'name' => $themeName,
            'type' => 'theme',
        ]]);

        $themeDetails = array_first(array_get($response, 'data'));
        if (!$themeDetails)
            return $this->output->writeln(sprintf('<info>Theme %s not found</info>', $themeName));

        $code = array_get($themeDetails, 'code');
        $hash = array_get($themeDetails, 'hash');
        $version = array_get($themeDetails, 'version');

        $this->output->writeln(sprintf('<info>Downloading theme: %s</info>', $code));
        $manager->downloadFile($code, $hash, [
            'name' => $code,
            'type' => 'theme',
            'ver' => $version,
        ]);

        $this->output->writeln(sprintf('<info>Extracting theme %s files</info>', $code));
        $manager->extractFile($code, theme_path('/'));

        $this->output->writeln(sprintf('<info>Installing %s theme</info>', $code));
        resolve(ThemeManager::class)->loadThemes();
        resolve(ThemeManager::class)->installTheme($code, $version);
    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'The name of the theme. Eg: demo'],
        ];
    }
}
