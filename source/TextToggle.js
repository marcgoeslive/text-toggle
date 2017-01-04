/*
 * Dieses Skript dient dazu mehrere Texte an einer Position darzustellen.
 * Es wird immer nur ein Text dargestellt. Der Text wird mithilfe von pfeilen weitergeschaltet.
 * 
 * @author Marc Wagner <no-reply@marc-wagner.eu>
 * @date 08.04.2016
 * @version 1.0
 */
$(document).ready(function () {
    new TextToggleHandler({width: 500});
});

/*
 * TextToggle Handler
 * Dient dazu alle TextToggles zu verwalten.
 */
function TextToggleHandler(p_Config) {
    this.m_Config = p_Config; // Konfiguration setzen
    this.m_TextToggleUniqueID = 1; // Unique ID wird vergeben für jeden Toggle
    this.m_TextToggleArray = new Array(); // Array mit allen Toggle Items

    /*
     * Auslesen aller vorhandenen JS-Toggle Systeme und erstellen eines neuen Objektes zu diesen
     */
    this.init = function () {
        var c = this; // Klasse temporär speichern 

        $(document).find(".js-texttoggle").each(function () {
            $(this).attr("id", "js-texttoggle-" + c.m_TextToggleUniqueID); // Einmalig eine Unique ID zuweisen
            $(this).attr("style", "width:" + c.m_Config.width + "px"); // Breite setzen


            // Objekt erstellen und im Array hinterlegen.
            c.m_TextToggleArray.push(new TextToggle(c.m_TextToggleUniqueID, $(this), c.m_Config));

            // Toggle id erhöhen
            ++c.m_TextToggleUniqueID; // Hochzählen, damit jede id nur einmal existiert
        });
    }

    /*
     * Event Handler hinzufügen, die dafür verantwortlich sind das weiterschalten zu 
     * übernehmen.
     */
    this.AttachEventHandler = function () {
        var c = this; // Klasse temporär speichern

        // Eventhandler bei dem Klicken auf den Pfeil Rechts
        $(document).on("click", ".js-texttoggle .left", function () {
            // ID auslesen
            var id = $(this).parent().attr("data-id");
            // Nächstes element anzeigen
            c.m_TextToggleArray[id - 1].Prev();
        });

        // Eventhandler beim Klicken auf den Pfeil links
        $(document).on("click", ".js-texttoggle .right", function () {
            // ID auslesen
            var id = $(this).parent().attr("data-id");
            // Nächstes element anzeigen
            c.m_TextToggleArray[id - 1].Next();
        });

        // Eventhandler beim Klicken auf einen der Dots unten
        $(document).on("click", ".js-texttoggle .dot", function () {
            // ID des TextToggle auslesen
            var id = $(this).parent().parent().parent().attr("data-id");
            // ID des aktuellen Items aussetzen
            var itemID = $(this).attr("data-id");

            c.m_TextToggleArray[id - 1].GoTo(itemID);
        });
    }

    this.init();
    this.AttachEventHandler();
}

/*
 * Die Klasse TextToggle
 */
function TextToggle(p_UniqueID, p_jQuery_Content, p_Config) {
    this.m_Config = p_Config;
    this.m_UniqueID = p_UniqueID;
    this.m_jQuery_Content = p_jQuery_Content; // Speichert das komplette jQuery Objekt
    this.m_Items = new Array();
    this.m_CurrentPosition = 0;
    
    /*
     * ID auslesen
     */
    this.ID = function(){
        return this.m_UniqueID;
    }

    /*
     * Nächstes element darstellen
     */
    this.Next = function () {
        // Position ersetzen
        var Position = 0;

        // Position erhöhen oder auf 0 setzen, je nachdem was als erstes eintritt.
        // Wird auf 0 gesetzt wenn das letzte element derzeit aktiv ist, damit es wieder von vorne anfangen kann.
        if (this.m_CurrentPosition == this.m_Items.length - 1) {
            Position = 0;
        } else {
            Position = this.m_CurrentPosition + 1;
        }

        this.GoTo(Position);
    }

    /*
     * Vorheriges element darstellen
     */
    this.Prev = function () {
        // Position ersetzen
        var Position = 0;

        // Position senken oder auf das letzte element setzen, je nachdem was als erstes eintritt.
        // Wird auf das letzte element gesetzt wenn das erste element derzeit aktiv ist, damit es wieder von hinten anfangen kann.
        if (this.m_CurrentPosition == 0) {
            Position = this.m_Items.length-1;
        } else {
            Position = this.m_CurrentPosition -1;
        }

        this.GoTo(Position);
    }

    /*
     * Goto funktion ermöglicht es über die Dots zu navigieren
     */
    this.GoTo = function(p_ItemID)
    {
        var c = this; // klasse temporär speichern 

        // sicherstellen das nicht auf das bereits aktive objekt geklickt wurde
        if (this.m_CurrentPosition != p_ItemID) {

            // Item ID als neue Position speichern - Dort wollen wir hin
            this.m_CurrentPosition = p_ItemID;

            // Interner zähler, der hochzählt damit alle items durchloffen werden
            var sel = 0;

            // Scrollposition berechnen
            var scrollTo = (-1) * (this.m_Config.width * this.m_CurrentPosition);

            // aktuell gewähltes item entfernen 
            $("#js-texttoggle-" + c.ID()).find(".js-text-item").animate({ marginLeft: scrollTo }, 500, function () {
                $(this).after(function () {
                    // Active entfernen
                    $("#js-texttoggle-" + c.ID()).find(".active").removeClass("active");

                    // Durchlaufen aller items um das nächste zu aktivieren
                    $("#js-texttoggle-" + c.ID()).find(".item").each(function () {
                        if (sel == c.m_CurrentPosition) {
                            $(this).addClass("active");
                        }
                        sel++;
                    });


                    // Dot active setzen
                    $("#js-texttoggle-" + c.ID() + " .dot-" + c.m_CurrentPosition).addClass("active");
                });
            });
        }
    }

    /*
     * Item hinzufügen
     */
    this.AddItem = function (p_Title, p_Text) {
        this.m_Items.push(new TextToggleItem(p_Title, p_Text));
    }

    /*
     * Initialisieren
     */
    this.initItems = function () {
        // Zwischenspeichern, damit diese Klasse auch später aufrufbar ist.
        var c = this; 

        // Überprüfen ob inhalt vorhanden ist
        if(this.m_jQuery_Content.length > 0)
        {
            // Alle Container auslesen
            this.m_jQuery_Content.find(".container").each(function () {
                // Item Objekt anlegen und in das Array speichern
                c.AddItem($(this).find(".title").text(), $(this).find(".text").text());
            });
        }
    }

    /*
     * Neue Ausgabe erzeugen
     */
    this.Render = function () {
        var c = this; // Klasse als Variable abspeichern

        // ID auslesen und das Objekt leeren
        $("#js-texttoggle-" + c.ID()).html("");
        // UniqueID hinzufügen in das Objekt
        $("#js-texttoggle-" + c.ID()).attr("data-id", c.ID());

        // Breite für das äußere div festlegen, damit dieser bereich dann versteckt ist
        var outter_width = this.m_Items.length * this.m_Config.width;

        // Neue Objekte einfügen so das wir sie dann verwenden können
        var container = $("#js-texttoggle-" + c.ID()).html("<div class='js-list' style='width:"+outter_width+"px;'><div class='js-text-item'></div></div><div class='left'></div><div class='right'></div><div class='dots' style='width:"+this.m_Config.width+"px;'></div>");
        
        for(var i = 0; i < this.m_Items.length; i++)
        {
            // Titel und Text zusammensetzen
            var title = "<div class='title'>" + this.m_Items[i].Title() + "</div>";
            var text = "<div class='text'>" + this.m_Items[i].Text() + "</div>";

            // Container integrieren
            if (i == 0) {
                // wir setzen hier das erste item als aktiv
                var item = "<div class='item active' style='width:" + this.m_Config.width + "px;'>" + title + " " + text + "</div>";

                // Dots hinzufügen
                container.find(".dots").append("<a href=\"javascript:void(0);\" title=\"" + this.m_Items[i].Title() + "\"><div class='dot dot-" + i + " active' data-id='" + (i) + "'></div></a>");
            } else {
                // jedes weitere Item wird normal initialisiert, so das es nicht sichtbar ist
                var item = "<div class='item' style='width:" + this.m_Config.width + "px;'>" + title + " " + text + "</div>";

                // Dots hinzufügen
                container.find(".dots").append("<a href=\"javascript:void(0);\" title=\"" + this.m_Items[i].Title() + "\"><div class='dot dot-" + i + "' data-id='" + (i) + "'></div></a>");
            }

            container.find(".js-text-item").append(item);
        }
        
        // Wir müssen jetzt noch die Position der Balken setzen
        // Kalkulieren wir erstmal die höhe der box
        setTimeout(function () {
            var height = (($("#js-texttoggle-" + c.ID()).height())/2 + (60/2))*-1;
            $("#js-texttoggle-" + c.ID() + " .left").attr("style", "margin-top:"+height+"px;");
            $("#js-texttoggle-" + c.ID() + " .right").attr("style", "margin-top:" + height + "px;");
        },50);
    }

    this.initItems(); // Initialisieren der Items -> Also auslesen aller Container und splitten
    this.Render(); // Ausgabe erzeugen
}

/*
 * Die Klasse TexToggleItem
 * Sie stellt ein einzelnes Item dar, welches sich in einem TextToggle Objekt befindet.
 */
function TextToggleItem(p_Title, p_Text)
{
    this.m_Title = p_Title; // Titel der dargestellt werden soll
    this.m_Text = p_Text; // Text der dargestellt werden soll

    /*
     * Titel auslesen
     */
    this.Title = function () {
        return this.m_Title;
    }

    /*
     * Text auslesen
     */
    this.Text = function () {
        return this.m_Text;
    }
}