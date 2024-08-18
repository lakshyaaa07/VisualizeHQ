from rest_framework import serializers
import pandas as pd


class CSVFileSerializer(serializers.Serializer):
    file = serializers.FileField()

    def to_representation(self, instance):
        df = pd.read_csv(instance['file'])
        return df.to_dict(orient="records")