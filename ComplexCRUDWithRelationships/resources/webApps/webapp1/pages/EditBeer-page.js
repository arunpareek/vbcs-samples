define([], function () {
    'use strict';

    var PageModule = function PageModule() {};

    // workaround for: BUFP-17180
    PageModule.prototype.assignStoredBeerQualities = function (helper, targetDefaultValue) {
        var source = helper.get("$chain.results.loadBeer.body.beerQualityCollection.items");
        return source.map(q => q.quality);
    };

    PageModule.prototype.createCreatePart2 = function (beerQuality) {
        return {
            "quality":beerQuality
        };
    };

    // workaround for: BUFP-17278
    PageModule.prototype.createPayload2 = function (beerRecord, selectedQualities) {
        var self = this;
        var changes = {};
        var qualitiesToDelete = beerRecord.beerQualityCollection.items.
                filter(q => selectedQualities.indexOf(q.quality) === -1).
                map(q => q.id);

        var originalQualities = beerRecord.beerQualityCollection.items.map(q => q.quality);
        var qualitiesToAdd = selectedQualities.
                filter(q => originalQualities.indexOf(q) === -1);

        var beerToSave = {
            name: beerRecord.name,
            alcoholPercentage: beerRecord.alcoholPercentage,
            imageURL: beerRecord.imageURL,
            country: beerRecord.country,
            beerType: beerRecord.beerRecord
        };
        changes.beerToSave = beerToSave;
        changes.recordsToDelete = qualitiesToDelete;
        changes.recordsToCreate = qualitiesToAdd.map(q => self.createCreatePart2(q, beerRecord.id));
        return changes;
    };

    return PageModule;
});
