export const translations = {
    // Navigation
    'nav.Search': 'Suche',
    'nav.EventPlaylist': 'Wunschliste',
    'nav.section.Admin': 'Administration',
    'nav.Events': 'Events',
    'nav.Videos': 'Videos',
    'nav.Playlists': 'Playlists',
    'nav.Scraping': 'Scraping',
    'nav.Settings': 'Einstellungen',
    // Video search
    'search.Title': 'Videosuche',
    'search.Duration': 'Dauer',
    'search.MakeAWish': 'Titel wünschen',
    'search.WishSuccessful': 'Dein Wunsch wurde registriert. Der Titel ist nun auf der Wunschliste.',
    'search.DefaultLockMessage': 'Die Wunschliste ist aktuell für neue Wünsche gesperrt. '+
        'Trotzdem kannst du weiterhin nach Titeln stöbern.',
    'search.err.Load': 'Das Suchergebnis konnte nicht geladen werden',
    'search.err.MakeAWish': 'Dein Wunsch konnte nicht eingetragen werden',
    // Wishlist
    'wishlist.Title': 'Wunschliste',
    'wishlist.NoResults': 'Momentan sind keine Titel auf der Wunschliste',
    'wishlist.Duration': 'Dauer',
    'wishlist.WaitTime': 'Geschätzte Wartezeit',
    'wishlist.err.Load': 'Beim Laden der Wunschliste ist ein Fehler aufgetreten',
    // Event list
    'events.Title': 'Events',
    'events.ActiveEvent': 'Aktuelles Event',
    'events.InactiveEvent': 'Inaktives Event',
    'events.Name': 'Name',
    'events.Description': 'Beschreibung',
    'events.Validity': 'Gültigkeitsbereich',
    'events.EditEvent': 'Event editieren',
    'events.Activate': 'Zum aktuellen Event machen',
    'events.Delete': 'Event löschen',
    'events.dialog.activate.Title': 'Ändern des aktiven Events',
    'events.dialog.activate.Content': '<p>Das Ändern des aktiven Events ändert auch die Playlist für neue '+
        'Liedwünsche.<br/>Bisher getätigte Wünsche werden dadurch nicht mehr in der Warteliste auftauchen.'+
        '</p><p>&nbsp;</p><p>Das Event <code>{current}</code> zum aktiven Event machen?</p>',
    'events.dialog.delete.Title': 'Event löschen',
    'events.dialog.delete.Content': 'Soll das Event <code>{current}</code> wirklich gelöscht werden?',
    'events.err.LoadActive': 'Laden des aktuell aktiven Events ist fehlgeschlagen.',
    'events.err.Delete': 'Das gewählte Event konnte nicht gelöscht werden.',
    'events.err.Activate': 'Das gewählte Event konnte nicht zum Aktiven gemacht werden.',
    // Event editor
    'eventEditor.Title': 'Event editieren',
    'eventEditor.fldName': 'Name',
    'eventEditor.fldDescription': 'Beschreibung',
    'eventEditor.fldStart': 'Start',
    'eventEditor.fldEnd': 'Ende',
    'eventEditor.Save': 'Event speichern',
    'eventEditor.err.Load': 'Die Eventdaten konnten nicht geladen werden.',
    'eventEditor.err.Create': 'Das neue Event konnte nicht erstellt werden.',
    'eventEditor.err.Update': 'Das Event konnte nicht bearbeitet werden.',
    // Videos
    'videos.Title': 'Karaoke videos',
    'videos.Artist': 'Künstler',
    'videos.RelatedMedium': 'Zugehöriges Medium',
    'videos.Duration': 'Dauer',
    'videos.FormatInfo': 'Format-informationen',
    'videos.NumWishes': 'Anzahl Wünsche',
    'videos.AddToPlaylist': 'Zu einer Playlist hinzufügen',
    'videos.Edit': 'Video-Details bearbeiten',
    'videos.Delete': 'Video löschen',
    'videos.Mbps': 'Mbps',
    'videos.Kbps': 'Kbps',
    'videos.AddToPlaylistSuccessful': 'Das Video wurde erfolgreich zur gewählten Playlist hinzugefügt',
    'videos.dialog.delete.Title': 'Video löschen',
    'videos.dialog.delete.Content': 'Willst du das Video <code>{name}</code> wirklich löschen?<br/>' +
        'Hierbei wird nur der Datenbankeintrag gelöscht. Die Videodatei bleibt intakt.',
    'videos.NameFormat': '{artist} - {title}',
    'videos.NameNone': '<i>kein Video gewählt</i>',
    'videos.err.AddToPlaylist': 'Beim Hinzufügen des Videos auf die Playlist ist ein Fehler aufgetreten',
    'videos.err.Delete': 'Das Video konne nicht gelöscht werden',
    // Video Editor
    'videoEditor.Title': 'Video-Details bearbeiten',
    'videoEditor.fldFilename': 'Dateiname',
    'videoEditor.fldLanguage': 'Sprache',
    'videoEditor.fldArtist': 'Künstler',
    'videoEditor.fldTitle': 'Titel',
    'videoEditor.fldDescription': 'Beschreibung',
    'videoEditor.fldRelatedMedium': 'Zugehöriges Medium',
    'videoEditor.fldMediumDetail': 'Medium-Details',
    'videoEditor.Save': 'Video-Details speichern',
    'videoEditor.err.Load': 'Beim Laden der Video-Details ist ein Fehler aufgetreten',
    'videoEditor.err.NoVideoSelected': 'Es wurde kein Video gewählt',
    'videoEditor.err.Save': 'Das Speichern der Änderungen ist fehlgeschlagen',
    // Playlists
    'playlists.Title': 'Playlists',
    'playlists.Current': 'Aktuell als Wunschliste aktiv',
    'playlists.Locked': 'Gesperrt für neue Wünsche',
    'playlists.Name': 'Name',
    'playlists.EventName': 'Name des Events',
    'playlists.LockMessage': 'Sperrnachricht',
    'playlists.EditEntries': 'Einträge anzeigen und bearbeiten',
    'playlists.EditDetails': 'Playlist-details bearbeiten',
    'playlists.Delete': 'Playlist löschen',
    'playlists.dialog.delete.Title': 'Playlist löschen',
    'playlists.dialog.delete.Content': 'Möchtest du die Playlist <code>{name}</code> wirklich löschen?',
    'playlists.FormattedName': '{name} (#{id})',
    'playlists.EmptyName': '<i>keine gewählt</i>',
    'playlists.err.Delete': 'Die gewählte Playlist konnte nicht gelöscht werden',
    // Playlist Editor
    'playlistEditor.Title': 'Playlist-details bearbeiten',
    'playlistEditor.fldName': 'Name',
    'playlistEditor.fldDescription': 'Beschreibung',
    'playlistEditor.fldLocked': 'Für neue Wünsche gesperrt',
    'playlistEditor.fldLockMessage': 'Anzuzeigende Nachricht',
    'playlistEditor.Save': 'Playlist-details speichern',
    'playlistEditor.err.Load': 'Das Laden der Playlistdetails ist fehlgeschlagen.',
    'playlistEditor.err.Save': 'Playlist-deteils konnten nicht aktualisiert werden.',
    // Playlist Entries
    'playlistEntries.Title': 'Playlist: {name}',
    'playlistEntries.TitleEmpty': 'Playlist',
    'playlistEntries.Empty': 'Diese Playlist hat noch keine Einträge',
    'playlistEntries.Duration': 'Länge',
    'playlistEntries.WaitTime': 'Geschätzte Wartezeit',
    'playlistEntries.ChangeRequester': 'Namen des Anfragenden ändern',
    'playlistEntries.ChangeSuccessful': 'Name des Anfragenden erfolgreich geändert',
    'playlistEntries.MoveToOther': 'Auf andere Playlist verschieben',
    'playlistEntries.MoveSuccessful': 'Der Eintrag wurde erfolgreich verschoben',
    'playlistEntries.Delete': 'Eintrag entfernen',
    'playlistEntries.DeleteSuccessful': 'Eintrag erfolgreich entfernt',
    'playlistEntries.dialog.delete.Title': 'Eintrag entfernen',
    'playlistEntries.dialog.delete.Content': 'Möchtest du diesen Eintrag wirklich von dieser Playlist entfernen?',
    'playlistEntries.dialog.changeRequester.Title': 'Namen des Anfragenden ändern',
    'playlistEntries.err.Load': 'Playlist-Einträge konnten nicht geladen werden',
    'playlistEntries.err.LoadInfo': 'Informationen zur Playlist konnten nicht geladen werden',
    'playlistEntries.err.NoListSelected': 'Es wurde keine Playlist gewählt',
    'playlistEntries.err.ChangeOrder': 'Der Eintrag konnte nicht neu einsortiert werden',
    'playlistEntries.err.Delete': 'Das Entfernen des gewählten Eintrags ist fehlgeschlagen',
    'playlistEntries.err.Move': 'Der gewählte Eintrag konnte nicht verschoben werden',
    'playlistEntries.err.Change': 'Der Name des Anfragenden konnte nicht geändert werden',
    // Scraping
    'scraping.Title': 'Scraping',
    'scraping.NoScrapesActive': 'Momentan werden keine Scrapes ausgeführt',
    'scraping.RootDirectory': 'Hauptverzeichnis',
    'scraping.CurrentFile': 'Aktuelle Datei',
    'scraping.StatsDescription': 'Anzahl der bearbeiteten Datein: Neu / Aktualisiert / Summe',
    'scraping.RuntimeDesc': 'Läuft seit (Gestartet um {start})',
    'scraping.Runtime': 'Läuft seit',
    'scraping.AutoReload': 'Liste automatisch neu laden',
    'scraping.DurationHours': 'Stunden',
    'scraping.DurationHour': 'Stunde',
    'scraping.DurationMinutes': 'Minuten',
    'scraping.DurationMinute': 'Minute',
    'scraping.DurationFormatHours': '{hours} {hourLabel} {minutes} {minuteLabel}',
    'scraping.DurationFormatMinutes': '~ {minutes} {minuteLabel}',
    'scraping.DurationLessThanOneMinute': 'weniger als eine Minute',
    'scraping.DurationNone': '-',
    'scraping.err.FailedToStart': 'Scraping-operation kann nicht gestartet werden.',
    'scraping.status.finished': 'Ferig',
    'scraping.status.running': 'Aktiv',
    'scraping.status.queued': 'Wartet',
    'scraping.status.failed': 'Fehlgeschlagen',
    'scraping.status.cancelled': 'Abgebrochen',
    'scraping.status.unknown': 'Unbekannter Status',
    // Playlist chooser
    'choosePlaylist.Title': 'Playlist wählen',
    'choosePlaylist.ContentWithRequester': 'Bitte wähle eine Playlist und einen Namen für den Anfragenden:',
    'choosePlaylist.Content': 'Bitte wähle eine Playlist:',
    'choosePlaylist.Playlist': 'Playlist',
    'choosePlaylist.RequesterName': 'Name des Anfragenden',
    'choosePlaylist.ChoosePlaylist': 'Playlist wählen',
    'choosePlaylist.err.LoadPlaylists': 'Beim Laden der verfügbaren Playlists ist ein Fehler aufgetreten',
    // Make a wish
    'makeAWish.Title': 'Fast geschafft...',
    'makeAWish.Content': 'Wir brauchen jetzt nur noch deinen Namen, damit wir dich aufrufen können, '+
        'sobald dein Lied an der Reihe ist:',
    'makeAWish.fldName': 'Name',
    'makeAWish.SelectedTitle': 'Diesen Titel hast du dir ausgesucht:',
    'makeAWish.MakeAWish': 'Wunsch eintragen',
    // Common list page
    'list.Empty': 'Keine Einträge gefunden',
    'list.err.Load': 'Beim Laden der Liste ist ein Fehler aufgetreten',
    // Login dialog
    'login.Title': 'Einloggen',
    'login.User': 'Benutzername',
    'login.Password': 'Kennwort',
    'login.Login': 'Log in',
    'login.err.Unexpected': 'Es ist ein unerwarteter Fehler aufgetreten: {err}',
    // User menu
    'user.LogIn': 'Log in...',
    'user.LogOut': 'Log out...',
    // Misc app settings
    'settings.Title': 'Einstellungen',
    'settings.ip.Title': 'IP whitelist',
    'settings.ip.Subtitle': 'Gäste, die sich von diesen IP-Adressen aus verbinden sind bezüglich Wünschen '+
        ' nicht limitiert. Auf diese Weise können Wunsch-Terminals aufgestellt werden, für die die Beschränkungen' +
        ' nicht gelten.',
    'settings.ip.Add': 'IP-Adresse hinzufügen',
    'settings.ip.ConfirmDeleteTitle': 'IP-Adresse entfernen',
    'settings.ip.ConfirmDelete': 'Willst du die Adresse <code>{ip}</code> von der Whitelist entfernen?',
    'settings.ip.err.Load': 'IP-whitelist konnte nicht geladen werden.',
    'settings.ip.err.Remove': 'Die gewählte IP-Adresse konnte nicht von der Whitelist entfernt werden.',
    'settings.ip.err.Add': 'Die neue IP-Adresse konnte nicht der Whitelist hinzugefügt werden.',
    'settings.ip.dialog.add.Title': 'IP-Adresse hinzufügen',
    'settings.ip.dialog.add.Description': 'Bitte gebe eine IP-Adresse ein, die der Whitelist hinzugefügt werden soll.',
    'settings.ip.dialog.add.Prompt': 'z.B. 127.0.0.1',
    // Shared
    'misc.Yes': 'Ja',
    'misc.No': 'Nein',
    'misc.Add': 'Hinzufügen',
    'misc.Ok': 'Ok',
    'misc.Cancel': 'Abbrechen',
    'misc.SearchBox': 'Suchtext hier eingeben...',
    'misc.NoResult': 'Keine Ergebnisse gefunden',
    'misc.Results': 'Ergebnisse',
    'misc.Of': 'von',
    'misc.WaitTime': 'beginnt in ~{time}',
    'misc.WaitTimeNone': 'spielt gerade',
    'misc.Info': 'Information',
    'misc.Close': 'Schließen',
    // Error type translations
    'err.NO_EVENT_SELECTED': 'Es wurde keine Veranstaltung gewählt. Bitte kontaktiere einen der Admins.',
    'err.UNKNOWN_ERROR': 'Ein unbekannter Fehler ist aufgetreten.',
    'err.ILLEGAL_PATH': 'Ungültiger Pfadname.',
    'err.DIR_NOT_FOUND': 'Das gewählte Verzeichnis existiert nicht, oder kann von Kyabia nicht gelesen werden.',
    'err.SCRAPE_ALREADY_QUEUED': 'Es gibt bereits eine Scraping-Operation für dieses Verzeichnis.',
    'err.STORAGE_QUERY_FAILED': 'Während einer Datenbankoperation ist ein Fehler aufgetreten.',
    'err.REQUIRED_FIELD_MISSING': 'Mindestens ein Pflichtfeld wurde nicht übergeben.',
    'err.PLAYLIST_NOT_FOUND': 'Die gewählte Playlist existiert nicht.',
    'err.EVENT_NOT_FOUND': 'Das gewählte Event existiert nicht.',
    'err.VIDEO_NOT_FOUND': 'Das gewählte Video existiert nicht.',
    'err.LOGIN_FAILED': 'Login fehlgeschlagen. Bitte überprüfe die eingegebenen Daten.',
    'err.ILLEGAL_R_ESPONSE_FORMAT': 'Die Antwort des Servers hatte ein unbekantes Format.',
    'err.NOT_LOGGED_IN': 'Um diese Funktion zu nutzen, musst du dich einloggen.',
    'err.ILLEGAL_IP_ADDRESS': 'Die angegebene IP-Adresse ist nicht valide. Bitte prüfe deine Eingabe.',
    'err.NO_DUPLICATE_WISHES': 'Der gewünschte Titel ist bereits in der Warteschlange. '+
        'Bitte warte bis der Titel gespielt wurde, bevor du dir eine Zugabe wünscht.',
    'err.TOO_MANY_WISHES': 'Es tut uns leid - du hast dir bereits zu viele Titel gewünscht. '+
        'Bitte warte vor weiteren wünschen, bis mindestens einer deiner Wünsche gespielt wurde.',
    // Languages
    'lang.Unknown': 'Unbekannte Sprache',
    'lang.ar': 'Arabisch',
    'lang.bg': 'Bulgarisch',
    'lang.bs': 'Bosnisch',
    'lang.cs': 'Tschechisch',
    'lang.da': 'Dänisch',
    'lang.de': 'Deutsch',
    'lang.el': 'Griechisch',
    'lang.en': 'Englisch',
    'lang.et': 'Estnisch',
    'lang.es': 'Spanisch',
    'lang.fi': 'Finnisch',
    'lang.fr': 'Französisch',
    'lang.ga': 'Irisch',
    'lang.hu': 'Ungarisch',
    'lang.it': 'Italienisch',
    'lang.is': 'Isländisch',
    'lang.ja': 'Japanisch',
    'lang.ko': 'Koreanisch',
    'lang.lt': 'Litauisch',
    'lang.nl': 'Niederländisch',
    'lang.no': 'Norwegisch',
    'lang.pl': 'Polnisch',
    'lang.pt': 'Portuiesisch',
    'lang.ro': 'Rumänisch',
    'lang.ru': 'Russisch',
    'lang.sk': 'Slovakisch',
    'lang.sl': 'Slovenisch',
    'lang.sr': 'Serbisch',
    'lang.sv': 'Schwedisch',
    'lang.th': 'Thai',
    'lang.tr': 'Türkisch',
    'lang.vi': 'Vietnamesisch',
    'lang.zh': 'Chinesisch',
    // Application info
    'app.PoweredBy': 'Powered by {app} - v{version}',
};
