'use client'
import * as lucide from 'lucide-react';
import { players } from "../public/players"
import { Select, SelectItem } from "@heroui/select";
import { Button } from '@heroui/button';
import { useState } from 'react';
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface Player {
  name: string;
  sex: 'men' | 'women';
}

export default function Home() {

  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  const [selectedPlayerKeys, setSelectedPlayerKeys] = useState<Set<string>>(new Set());
  const [selectedTeamQuantityKey, setSelectedTeamQuantityKey] = useState<Set<string>>(new Set());

  const playersToShow = Array.from(selectedPlayerKeys)
    .map(name => players.find(p => p.name === name))
    .filter(Boolean) as Player[];

  const handleGenerateTeams = () => {
    const teamQuantity = Array.from(selectedTeamQuantityKey).at(0);

    console.log("Jogadores selecionados:", playersToShow);
    console.log("Quantidade de times selecionada:", teamQuantity);

    if (playersToShow.length === 0 || !teamQuantity) {
      alert('Por favor, selecione jogadores e a quantidade de times.');
      return;
    }
  };


  const teamQuantityOptions = [
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
  ];


  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <lucide.Volleyball className="w-24 h-24" />


        <h1 className=" text-5xl font-bold mt-4 text-center">
          Gerador de times
        </h1>
      </div>



      <div className="p-8 w-full max-w-lg">
        <Select
          className="w-full mb-3"
          variant="flat"
          radius="lg"
          label="Selecione os jogadores"
          onSelectionChange={(keys) => {
            setSelectedPlayerKeys(keys as Set<string>);
          }}
          placeholder="Selecione um ou mais jogadores"
          selectionMode="multiple"
        >
          {sortedPlayers.map((player) => (
            <SelectItem key={player.name} value={player.name}>{player.name}</SelectItem>
          ))}
        </Select>

        <Select
          className="max-w-xs w-full mb-3"
          label="Quantidade de Times"
          placeholder="Selecione a quantidade"
          onSelectionChange={(keys) => {
            setSelectedTeamQuantityKey(keys as Set<string>);
          }}
        >
          {teamQuantityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>



      <div className="mt-6 border-t pt-6 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Jogadores Selecionados:</h2>
        <div className="space-y-2">
          <ScrollShadow className="w-[full] h-[300px]">
            {playersToShow.map((player, index) => (
              <div key={player.name} className="flex items-center text-gray-700">
                <span className='mr-3 mt-3'>{player.name}</span>
                {player.sex === 'women' ? (
                  <Chip color="danger" variant="flat">Mulher</Chip>
                ) : (
                  <Chip color="primary" variant="flat">Homem</Chip>
                )}
              </div>
            ))}
          </ScrollShadow>
        </div>
      </div>

      <Button color='primary' className='w-full' onClick={handleGenerateTeams}>
        Gerar times
      </Button>
    </>
  );
}