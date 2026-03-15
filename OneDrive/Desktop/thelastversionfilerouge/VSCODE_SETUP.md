# BricoTrust - VS Code Development Setup Guide

## Quick Start

### 1. Install Required Extensions

Run this in VS Code terminal or use Extensions sidebar:

```bash
code --install-extension bmewburn.vscode-intelephense-client
code --install-extension onecentlin.laravel-extension-pack
code --install-extension onecentlin.laravel-blade
code --install-extension ryannaddy.laravel-artisan
code --install-extension cweijan.vscode-database-client2
code --install-extension felixbecker.php-debug
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph
```

Or use the recommendations in `.vscode/extensions.json` - VS Code will prompt you to install them.

### 2. PHP & Laravel Setup

**PHP Intelephense** - Advanced PHP code intelligence:

- Automatically configured in `.vscode/settings.json`
- Provides code completion, hover information, and parameter hints
- Set to exclude `vendor/`, `storage/`, and `node_modules/`

**Laravel Artisan Extension** - Visual command palette:

- Access artisan commands from VS Code command palette (Ctrl+Shift+P)
- Quick access to `make:` commands for controllers, models, migrations, etc.

### 3. Available Tasks (Ctrl+Shift+B or Tasks: Run Task)

**Laravel Commands:**

- `Laravel: Start Local Server` - Runs `php artisan serve`
- `Laravel: Run Migrations` - Executes pending migrations
- `Laravel: Run Migrations (Refresh)` - Resets and re-runs migrations
- `Laravel: Run Seeds` - Seeds the database
- `Laravel: Clear Cache` - Clears all caches
- `Laravel: Optimize` - Optimizes the application

**Composer Commands:**

- `Composer: Install` - Install dependencies
- `Composer: Update` - Update dependencies

**NPM Commands:**

- `NPM: Install` - Install JS dependencies
- `NPM: Run Dev` - Watch and compile assets
- `NPM: Run Build` - Build for production

### 4. Debugging with XDebug

**Setup PHP with XDebug:**

1. Install XDebug extension for PHP:

   ```bash
   pecl install xdebug
   ```

2. Configure `php.ini`:

   ```ini
   [XDebug]
   zend_extension = xdebug.so
   xdebug.mode = debug
   xdebug.start_with_request = yes
   xdebug.client_port = 9003
   xdebug.client_host = 127.0.0.1
   ```

3. Use breakpoints in VS Code:
   - Click on line numbers to set breakpoints
   - Press F5 to start debugging (or use "Listen for XDebug" configuration)
   - Step through code with F10, step into with F11

### 5. Code Formatting

**Automatic formatting on save:**

- PHP files: Uses PHP Intelephense formatter
- JavaScript/CSS/JSON: Uses Prettier
- Blade templates: Uses Laravel Blade formatter

**Manual formatting:**

```
Shift+Alt+F  - Format document
Ctrl+K, Ctrl+F - Format selection
```

**Format on paste:**

- Enabled by default for better code quality

### 6. Git Integration

**GitLens Features:**

- Hover over code to see last commit info
- View file history and blame
- Compare branches and commits
- Access Git Graph for visual history

**Git Commands:**

- `Ctrl+Shift+G` - Open Git sidebar
- `Ctrl+G` - Go to Line
- Stage, commit, push directly from sidebar

### 7. Database Management

**Using Database Client Extension:**

1. Open Command Palette (Ctrl+Shift+P)
2. Search "Database: Add Connection"
3. Select MySQL (or your DB)
4. Configure connection:
   ```
   Host: localhost
   User: root (or your db user)
   Password: (your password)
   Database: bricotrust (or your db name)
   ```
5. Browse tables, run queries, manage data visually

### 8. Recommended VS Code Keyboard Shortcuts

| Shortcut         | Action            |
| ---------------- | ----------------- |
| `Ctrl+Shift+P`   | Command Palette   |
| `Ctrl+Shift+B`   | Run Tasks         |
| `Ctrl+K, Ctrl+0` | Fold All          |
| `Ctrl+K, Ctrl+J` | Unfold All        |
| `Ctrl+/`         | Toggle Comment    |
| `Shift+Alt+F`    | Format Code       |
| `Ctrl+H`         | Find & Replace    |
| `Ctrl+Shift+G`   | Git Sidebar       |
| `Ctrl+grave`     | Toggle Terminal   |
| `F5`             | Start Debugging   |
| `F9`             | Toggle Breakpoint |
| `F10`            | Step Over         |

### 9. Useful Settings Already Configured

- **Auto-save**: Set to save after 1000ms delay
- **Word wrap**: Enabled for better readability
- **Rulers**: Set at 80 and 120 characters for PSR-12 compliance
- **excluded folders**: `vendor/`, `node_modules/`, `.git/` not shown in explorer
- **Tab size**: PHP (4 spaces), JavaScript (2 spaces) per PSR-12

### 10. Created Configuration Files

- `.vscode/settings.json` - Editor settings
- `.vscode/launch.json` - Debugging configuration
- `.vscode/tasks.json` - Artisan and Composer commands
- `.vscode/extensions.json` - Recommended extensions
- `.editorconfig` - Cross-editor code style
- `.prettierrc` - Prettier formatting rules
- `.eslintrc.json` - JavaScript linting rules

### 11. Tips & Tricks

**IntelliSense & Code Completion:**

- Start typing and press `Ctrl+Space` for suggestions
- Use `Tab` or `Enter` to accept completion
- Hover over functions to see documentation

**Quick Navigation:**

- `Ctrl+P` - Open any file by name
- `Ctrl+F` - Find in current file
- `Ctrl+Shift+F` - Find across workspace
- `Ctrl+G` - Go to specific line

**Terminal Usage:**

- Press `` Ctrl+` `` to toggle terminal
- Terminal automatically opens in project root
- Run PHP and Composer commands directly

**Debugging Artisan Commands:**

- Run: `php artisan tinker` in integrated terminal
- Test code snippets interactively
- Jump into models and methods

### 12. Advanced: Remote Development

If developing on a remote server:

1. Install "Remote - SSH" extension
2. Use `Remote-Containers` for Docker
3. Configurations will sync automatically

## Troubleshooting

**PHP Intelephense not working?**

- Check `editor.defaultFormatter` is set to `bmewburn.vscode-intelephense-client`
- Ensure PHP is installed and in PATH: `php -v`

**Debugging not stopping at breakpoints?**

- Verify XDebug is installed: `php -m | grep Xdebug`
- Check port 9003 is accessible
- Ensure `xdebug.mode = debug` in php.ini

**Extensions not showing?**

- Open VS Code > Extensions > search for recommended
- Click "Install" in the "Recommended" tab

## Next Steps

1. **Verify Setup:**

   ```bash
   php -v
   composer --version
   npm --version
   git --version
   ```

2. **Start Development:**
   - Run `Composer: Install` task
   - Run `Laravel: Start Local Server` task
   - Access at `http://localhost:8000`

3. **Setup Database:**
   - Configure `.env` file
   - Run `Laravel: Run Migrations` task
   - Run `Laravel: Run Seeds` task (optional)

4. **Happy Coding!** 🚀

---

For questions or updates, refer to:

- [Laravel Documentation](https://laravel.com/docs)
- [VS Code Tips & Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- [Blade Templates Engine](https://laravel.com/docs/blade)
