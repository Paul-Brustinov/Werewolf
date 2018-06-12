/*! Select2 4.0.0-rc.2 | https://github.com/select2/select2/blob/master/LICENSE.md */

(function() {
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) var e = jQuery.fn.select2.amd;
    return e.define("select2/i18n/fr",
        [],
        function() {
            return{
                inputTooLong: function(e) {
                    var t = e.input.length - e.maximum, n = "Supprimez " + t + " caractère";
                    return t !== 1 && (n += "s"), n
                },
                inputTooShort: function(e) {
                    var t = e.minimum - e.input.length, n = "Saisissez " + t + " caractère";
                    return t !== 1 && (n += "s"), n
                },
                loadingMore: function() { return"Chargement de résultats supplémentaires…" },
                maximumSelected: function(e) {
                    var t = "Vous pouvez seulement sélectionner " + e.maximum + " élément";
                    return e.maximum !== 1 && (t += "s"), t
                },
                noResults: function() { return"Aucun résultat trouvé" },
                searching: function() { return"Recherche en cours…" }
            }
        }), { define: e.define, require: e.require }
})();