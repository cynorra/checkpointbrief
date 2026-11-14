---
title: "Play Epic Games on Steam Deck: Heroic Launcher Setup"
description: "Detailed guide to install Epic Games Store free titles on Steam Deck using Heroic Games Launcher, including Proton GE setup and adding to Gaming Mode."
published: 2026-11-16
tool: deals
---
**To play Epic Games Store free titles on Steam Deck, install the Heroic Games Launcher via Desktop Mode's Discover Software Center, then configure it with your Epic account, download games, and add them as non-Steam shortcuts to integrate into Gaming Mode for optimal controller support and performance.** This process requires navigating Linux environments and specific Proton compatibility layers, which are detailed in the step-by-step instructions below.

## Initial Setup: Accessing Desktop Mode and Installing Heroic

Accessing the Steam Deck's underlying Linux desktop environment is the foundational step for installing third-party launchers like Heroic Games Launcher. This mode provides a traditional desktop interface necessary for software management.

1.  **Enter Desktop Mode:**
    *   Press the `Steam` button.
    *   Navigate to `Power`.
    *   Select `Switch to Desktop`. The Steam Deck will transition from Gaming Mode to a KDE Plasma desktop environment.
2.  **Install Heroic Games Launcher:**
    *   Locate and open the `Discover Software Center` (blue shopping bag icon) on the desktop or via the application launcher.
    *   In the Discover search bar, type "Heroic Games Launcher".
    *   Select `Heroic Games Launcher` from the search results.
    *   Click the `Install` button. The application will download and install automatically.
3.  **Return to Gaming Mode (Optional, for now):**
    *   Once Heroic is installed, you can return to Gaming Mode by double-clicking the `Return to Gaming Mode` shortcut on the desktop. However, the next steps require remaining in Desktop Mode for initial configuration.

## Configuring Heroic Games Launcher and Proton GE

After installation, Heroic requires configuration to access your Epic Games library and to ensure game compatibility through Proton GE. Proton GE (GloriousEggroll) is a community-maintained version of Valve's Proton compatibility layer, often providing better performance or compatibility for specific titles than official Proton versions.

1.  **Launch and Log In to Heroic:**
    *   Open `Heroic Games Launcher` from the desktop or application launcher.
    *   On the initial setup screen, select `Login with Epic Games`. A browser window will open, prompting you to log in to your Epic Games account. Complete the login process and close the browser tab. Heroic will then sync your Epic Games library.
2.  **Install Proton GE:**
    *   Within Heroic, navigate to the `Wine Manager` section (typically found in the left-hand sidebar).
    *   Select the `Proton GE` tab.
    *   Click `Download` next to the latest stable Proton GE version (e.g., `GE-Proton8-25`). This downloads the necessary compatibility layer for running Windows games on Linux.
3.  **Install an Epic Games Store Title:**
    *   Browse your Epic Games library within Heroic.
    *   Select a game you wish to install.
    *   Click `Install`.
    *   Choose an installation directory. The default location within your user's home folder (e.g., `/home/deck/Games/Heroic/`) is generally suitable. Ensure sufficient storage space is available; some free titles, such as *Grand Theft Auto V* when it was offered, can exceed 90 GB.
    *   Once installation is complete, do not launch the game directly from Heroic yet.

## Integrating Epic Games into Steam Gaming Mode

For the best Steam Deck experience, including controller support, Steam Input customization, and seamless library integration, add your installed Epic Games titles as non-Steam games to your Steam library.

1.  **Add Game to Steam:**
    *   In Heroic, navigate to the game you just installed.
    *   Click the three-dot menu (or gear icon) next to the game title.
    *   Select `Add to Steam`. Heroic will automatically create a shortcut in your Steam library.
2.  **Configure Proton Compatibility in Steam:**
    *   Return to `Gaming Mode` (via the desktop shortcut).
    *   In Steam, navigate to your `Library`.
    *   Locate the newly added Epic Games title under the `Non-Steam` tab.
    *   Select the game, then choose `Manage` (gear icon) > `Properties`.
    *   Go to `Compatibility`.
    *   Check `Force the use of a specific Steam Play compatibility tool`.
    *   From the dropdown menu, select the `Proton GE` version you installed via Heroic (e.g., `GE-Proton8-25`).
3.  **Launch and Test:**
    *   Launch the game from your Steam library. It should now run with Proton GE, leveraging Steam Input for controller support.

## Heroic Games Launcher vs. Direct Epic Games Launcher Installation

While it is technically possible to install the official Epic Games Launcher directly via Steam's "Add a Non-Steam Game" feature and force Proton, Heroic Games Launcher offers several advantages specifically tailored for the Steam Deck's Linux environment.

<div class="table-wrap"><table>
<thead>
<tr>
<th>Feature/Aspect</th>
<th>Heroic Games Launcher</th>
<th>Direct Epic Games Launcher (via Steam/Proton)</th>
</tr>
</thead>
<tbody>
<tr>
<td>**Installation Method**</td>
<td>Native Flatpak via Discover Software Center.</td>
<td>Windows .exe installed via Steam's "Add a Non-Steam Game" and Proton.</td>
</tr>
<tr>
<td>**Proton/Wine Management**</td>
<td>Integrated Wine Manager for easy Proton GE installation and selection per game.</td>
<td>Relies on Steam's Proton versions; Proton GE requires manual installation into specific Steam directories.</td>
</tr>
<tr>
<td>**Game Management**</td>
<td>Dedicated interface for Epic, GOG, and Amazon Games libraries; per-game settings.</td>
<td>Launches the full Epic Games Launcher, which then manages games. More resource-intensive.</td>
</tr>
<tr>
<td>**Offline Mode**</td>
<td>Robust offline play support for installed games.</td>
<td>Epic Games Launcher can be finicky with offline mode, sometimes requiring online checks.</td>
</tr>
<tr>
<td>**Updates**</td>
<td>Manages game updates directly within Heroic.</td>
<td>Requires launching the Epic Games Launcher to check for and apply updates.</td>
</tr>
<tr>
<td>**Resource Usage**</td>
<td>Lighter footprint, designed for Linux.</td>
<td>Heavier, as it's running a full Windows application layer for the launcher itself.</td>
</tr>
<tr>
<td>**Steam Integration**</td>
<td>One-click "Add to Steam" for individual games, creating direct shortcuts.</td>
<td>Typically adds the Epic Games Launcher itself as a non-Steam game; requires launching the launcher first, then the game.</td>
</tr>
<tr>
<td>**Controller Support**</td>
<td>Seamless Steam Input for individual game shortcuts.</td>
<td>Can be complex to configure Steam Input for the launcher and then the game.</td>
</tr>
</tbody>
</table></div>

### Common Pitfalls and Optimization Tips

*   **Login Issues:** If Epic Games login fails in Heroic, try clearing Heroic's cache or restarting the application. Ensure your Steam Deck's system clock is accurate.
*   **Proton GE Selection:** Always use the latest stable Proton GE version unless a specific older version is known to work better for a particular game. Check ProtonDB for game-specific recommendations.
*   **Shader Cache:** Initial game launches may experience stuttering as the Steam Deck compiles shader caches. This typically resolves after the first play session.
*   **Controller Mapping:** For games with unusual controller layouts, use Steam Input's extensive customization options (accessible via the `Steam` button in-game).
*   **Storage Management:** Epic Games titles can be large. Regularly check your Steam Deck's storage via `Settings > Storage` in Gaming Mode. Consider adding an M.2 SSD for expanded capacity if you plan to install many titles.
*   **Game Updates:** Periodically launch Heroic Games Launcher in Desktop Mode to check for and apply updates to your installed Epic Games titles. Updates are not automatically managed by Steam.
*   **Internal Linking:** For more information on how free games are distributed, consult our guide on [How Epic Games Store Free Games Work: Times, Rules and Catches](/guides/how-epic-free-games-work/).

## Official Sources and Verification
- **[Heroic Games Launcher]:** [Heroic Games Launcher Official Documentation](https://heroicgameslauncher.com) – Provides installation instructions, troubleshooting, and feature overviews for the launcher.
- **[Valve Steam Deck]:** [Steam Deck Proton Documentation](https://store.steampowered.com/steamdeck) – Details Valve's Proton compatibility layer and its role in running Windows games on Steam Deck.
